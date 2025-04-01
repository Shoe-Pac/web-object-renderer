export interface ModelData {
  name: string
  category: string
  fileUrl: string
}

export interface FileMetadata extends ModelData {
  filename: string
}

export type EditModelsProps = {
  refreshScene: (modelNames: string[]) => void
  availableModels: ModelData[]
}
