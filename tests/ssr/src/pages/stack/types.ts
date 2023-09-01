type StackProps = {
  run: boolean
  onComplete: () => void
}

export type StackTest = React.FC<StackProps>

export type Status = 'running' | 'success' | 'error'

export type Feature = { name: string; status: Status }

export type Features = Feature[]
