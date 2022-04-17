declare module 'vue/types/vue' {
  interface Vue {
    $enum (enumName: string, asArray?: boolean): any
  }
}

export interface Vue {
    $enum (enumName: string, asArray?: boolean): any
}
