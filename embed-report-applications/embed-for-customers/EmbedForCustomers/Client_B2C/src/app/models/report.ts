export interface IEmbedReport{
    reportId: string;
    reportName: string;
    embedUrl: string;
}

export interface IEmbedToken{
    tokenId: string;
    token: string;
    expiration: string;
}

export interface IEmbedParams{
    type: string;
    embedReports: IEmbedReport[];
    embedToken: IEmbedToken;
}