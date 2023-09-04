type StackProps = {
  title: string
  description?: string
  TestStackComponent: React.ElementType
  run: boolean
  onComplete: () => void
}

export type StackTest = React.FC<StackProps>

export type StackComponent = React.FC<Pick<StackProps, 'onComplete' | 'run' | 'title' | 'description'>>

export type Status = 'running' | 'success' | 'error'

export type Feature = { name: string; status: Status; jsonBody?: any }

export type Features = Feature[]
