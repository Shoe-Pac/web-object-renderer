import { ModelData } from './objModels'

export interface loginForm {
  email: string
  password: string
}

export interface registrationForm extends loginForm {
  name: string
}

export type editModelsForm = {
  file: File | null
  modelName: string
  category: string
  selectedModels: ModelData[]
}
