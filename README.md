# react-promise-container
PromiseContainer is a higher-order component to run a single or multiple promises, before rendering a component.

## Installation

```
npm install react-promise-container --save
```

## Usage
To wrap your component with some promises, do something like this:

```jsx
import promiseContainer from 'react-promise-container';
import {getUser} from './some-file-with-api-calls';
import ExampleComponent from './ExampleComponent';

function mapPromisesToProps() {
  return {
    user: getUser(),
  }
}

export default promiseContainer(mapPromisesToProps)(ExampleComponent);
```

You can define as many promises as you want and use the props that are given from higher up:

```jsx
import promiseContainer from 'react-promise-container';
import {getUser, getArticle} from './some-file-with-api-calls';
import ExampleComponent from './ExampleComponent';

function mapPromisesToProps(ownProps) {
  return {
    user: getUser(),
    article: getArticle(ownProps.articleId),
  }
}

export default promiseContainer(mapPromisesToProps)(ExampleComponent);
```

### When all promises are fulfilled
As soon as all promises are fulfilled, `ExampleComponent` will be rendered. The results of the promises will be passed as props called `user` and `article`:

```jsx
class ExampleComponent extends React.Component {
  render() {
    const {user, article} = this.props;
    return <div>
      <p>{article.title}</p>
      <p>{article.body}</p>
      <p>Posted by {user.name}</p>
    </div>
  }
}
````

Note that you don't have to handle any loading state inside of your presentational component. That's because this component is only rendered after all promises are fulfilled.

### While promises are pending
To render something while pending, pass it as a second component:

```jsx
promiseContainer(mapPromisesToProps)(
  ExampleComponent,
  LoadingComponent,
);
```

or something like:

```jsx
promiseContainer(mapPromisesToProps)(
  ExampleComponent,
  () => <p>One moment please...</p>,
);
```

### When a promise fails
To render something else when something went wrong, pass it as the third component:

```jsx
promiseContainer(mapPromisesToProps)(
  ExampleComponent,
  LoadingComponent,
  ErrorComponent,
);
```

or something like:

```jsx
promiseContainer(mapPromisesToProps)(
  ExampleComponent,
  () => <p>One moment please...</p>,
  error => <p>{error.message}</p>,
);
```

## Updating promises
At some point, you'd probably want the result of a promise to be updated. For example, when you want to edit an article that you've fetched before. There are a couple of ways to do this:

### `props.promiseContainer.refresh()`
This function is passed to your component and it will rerun all promises that were given. After fulfilling the promises again, the new result will be passed by the same props. At this moment, this will not change to a pending state in the process.

### `props.promiseContainer.mutate(promise, expectedResult)`
You can use this function to implement optimistic UI. You pass it a promise (for example, to make a request to an API) and a function to describe what the expected result for this mutation is. For example, this is how you could implement a like button:

```jsx
const {addLike, removeLike, isLiking} from './like-api';

class LikeButton extends React.Component {
  render() {
    return <button onClick={e => this.toggle(e)}>
      {this.props.isLiking ? 'unlinke' : 'like'}
    </button>;
  }

  toggle(e) {
    const {mutate, refresh} = this.props.promiseContainer;
    const saveFn = () => this.props.isLiking ? addLike() : removeLike();
    mutate(saveFn, previousResult => {
      return { isLiking: !previousResult.isLiking };
    }).then(refresh);
  }
}

function mapPromisesToProps() {
  return {
    isLiking: isLiking(),
  };
}

export default promiseContainer(mapPromisesToProps)(LikeButton);
```

This will update the result of `isLiking` immediately, even before the request to save its new state is started. After the request of the mutation is done, the actual truth will be refetched. If this function fails, it will revert to the original result. Based on [this excellent article](https://www.smashingmagazine.com/2016/11/true-lies-of-optimistic-user-interfaces/#rules-of-thumb), something like this should never take more than 2 seconds, so this promise will fail if it takes more than that.
