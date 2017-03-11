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

## TODO
- [ ] Write documentation about `promiseContainer.refresh`
- [ ] Write documentation about `promiseContainer.mutate` (optimistic UI)
