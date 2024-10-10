export interface UserType {
    id: number;
    first_name: string;
    last_name: string;
    about: string;
    email: string;
    profile_pic: string;
    created_at?: string;
    user_type: string;
  }

export interface PostType {
    id: number;
    title: string;
    shortDescription: string;
    content: string;
    slug: string;
    image: string;
    user_id: number;
    users?: UserType;
    categories?: CategoryType[];
    created_at?: string;
    updated_at?: string;
    views: number;
    likes: number;
    commentsCounter: number;
  }

  export interface CategoryType {
    id: number;
    name: string;
    description: string;
    slug: string;
    image: string;
    posts?: PostType[];
    created_at?: string;
    updated_at?: string;
  }

  export interface CommentType {
    id: number;
    content: string;
    post_id: number;
    user_id: number;
    post?: PostType;
    user?: UserType;
    created_at?: string;
    updated_at?: string;
    liked: boolean;
  }
