export type DocumentPage = {
    id: string,
    title: string,
    content: string,
    contentType: "html" | "lexHtml" | "text" | "image",
    parentId: string | undefined,
    // children: DocumentPage[],
}

export type IdParentPair = {
    parentId: string | undefined,
}

export type IdDictionary = {
    [id: string]: IdParentPair,
}
