import { RESOUCES_API_BASE_URL } from "@/service/api";


class ResourceResolver {
    private static COVER_PLACEHOLDER_URL = "/img/photo/cover.jpeg";
    private static AVATAR_PLACEHOLDER_URL = "/img/photo/placeholder.png";

    resolve(filename?:string): string {
        if (!filename) return "";
        return this.isExternalLink(filename) ? filename : `${RESOUCES_API_BASE_URL}/${filename}`;
    }
    
    profilePhoto(profilePhoto?:string): string {
        if (!profilePhoto) return ResourceResolver.AVATAR_PLACEHOLDER_URL;
        return this.isExternalLink(profilePhoto) ? profilePhoto : `${RESOUCES_API_BASE_URL}/${profilePhoto}`;
    }
    
    coverPhoto(coverPhoto?:string): string {
        if (!coverPhoto) return ResourceResolver.COVER_PLACEHOLDER_URL;
        return this.isExternalLink(coverPhoto) ? coverPhoto : `${RESOUCES_API_BASE_URL}/${coverPhoto}`;
    }

    private isExternalLink(url:string):boolean {
        return url.startsWith('http://') || url.startsWith('https://');
    }
}

const resourceResolver = new ResourceResolver();

export default resourceResolver;