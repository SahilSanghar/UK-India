export interface PageProps {
  id: string;
  title: string;
  type: string;
  logos?: {
    title?: string;
    items?: {
      image: string;
      alt: string;
    }[];
  };
  lander: {
    title: string[];
    title2?: string[];
    des: string[];
    image: string[];
    flip: boolean;
    button: {
      enable: boolean;
      text: string;
      link: string;
    };
  };
  contact?: {
    title: string;
    content: string;
    image: string;
  };
  box?: {
    title: string;
    content: string;
    buttonTxt: string;
    link: string;
    image: string[];
  }[];
  what: {
    title: string;
    des: string;
    cards: {
      title: string;
      des: string;
      images: string[];
    }[];
  };
  stats?: {
    title: string;
    cards: {
      title: string;
      valueBefore: string;
      valueAfter: string;
      number: number;
      des: string;
      disclaimer: string;
      link: string;
    }[];
  };
  who?: {
    title: string;
    cards: {
      title: string;
      image: string;
    }[];
  };
  membership?: {
    title: string;
    subtitle: string;
    des: string;
    image: string;
    buttonTxt: string;
    link: string;
  };
  testimonials?: {
    quote: string;
    des: string;
    name: string;
    role: string;
    image: string;
    link: string;
  }[];
  company?: {
    image: string;
    link: string;
  }[];
  fullscreen?: {
    title: string;
    des: string;
    cards: {
      title: string;
      buttonTxt: string;
      des: string;
      link: string;
      image: string;
    }[];
  };
}
