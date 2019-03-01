type Props = Object;

interface ObjectWithPromises {
  [key: string]: Promise<any>
}

interface Config {
  shouldPromiseRefresh?: (props: Props, prevProps: Props) => boolean,
  preventLogging?: boolean,
}

export default function promiseContainer(
  getPromises: (props: Props) => ObjectWithPromises,
  config?: Config
): (
  FulfilledComponent: React.ComponentType<any>,
  PendingComponent?: React.ComponentType<any>,
  RejectedComponent?: React.ComponentType<any>
) => React.ComponentType<any>
