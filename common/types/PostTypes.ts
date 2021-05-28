export interface PostInfo {
    id: number;
    firstLine: string;
    secondLine: string;
    thirdLine: string;
    author: string;
    
    doesUserSnap: boolean;
    snappers?: number;
}