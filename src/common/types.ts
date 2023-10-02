
export type DocumentStyle = "html" | "lexHtml" | "text" | "image" | "flow";

export type DocumentPage = {
    id: string,
    title: string,
    content: string,
    contentType: DocumentStyle,
    parentId: string | undefined,
}


export type IReturnState = {
    isError: boolean,
    errorItem?: string,
    message?: string,
}

export type IdParentPair = {
    parentId: string | undefined,
}

export type IdDictionary = {
    [id: string]: IdParentPair,
}
