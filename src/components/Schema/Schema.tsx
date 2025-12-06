import type {Media, Post} from '@/payload-types'

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