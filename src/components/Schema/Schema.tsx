import type {Media, Post, User} from '@/payload-types'

export interface ArticleSchemaProps{
    
    '@context': string;
    '@type': string;
    headline: string;
    datePublished: Date;
    dateModified: Date;
    image: string | null | undefined;
    author: {
        type: string;
        name: string | User;
    };

}

export const articleSchema = (props:Post)=>{
const image:Media = props.meta?.image as Media

    return {
        '@context':'https://schema.org',
        '@type':'Article',
        headline:props.title,
        datePublished: new Date(props.createdAt),
        dateModified:new Date(props.updatedAt),
        image:image?image.url:'',
        author:{
 type:'Person',
            name:props.authors?props.authors[0]:'Aleksander Gadomski'
        }
           
        
    }
}