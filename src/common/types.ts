
export type DocumentStyle = "html" | "lexHtml" | "text" | "image" | "flow";

export type DocumentPage = {
    id: string,
    title: string,
    text: string,
    html: string | undefined,
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
