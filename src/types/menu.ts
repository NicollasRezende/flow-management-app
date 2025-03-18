export interface MenuNode {
    id: string;
    type: 'button' | 'list' | string;
    title: string;
    content: string;
    options?: MenuOptions;
    form?: MenuForm;
    extraActions?: MenuAction[];
    position: {
      x: number;
      y: number;
    };
  }
  
  export interface MenuOptions {
    menu_type: 'button' | 'list' | string;
    buttons?: MenuButton[];
    header?: string;
    footer?: string;
    button_text?: string;
    sections?: MenuSection[];
  }
  
  export interface MenuButton {
    id: string;
    title: string;
    next_menu?: string;
    action?: string;
  }
  
  export interface MenuSection {
    title: string;
    rows: MenuRow[];
  }
  
  export interface MenuRow {
    id: string;
    title: string;
    next_menu?: string;
  }
  
  export interface MenuForm {
    type: 'free_text' | 'structured' | string;
    submit_text?: string;
    action?: string;
    fields?: MenuFormField[];
  }
  
  export interface MenuFormField {
    id: string;
    type: 'text' | 'number' | 'email' | 'select' | string;
    label: string;
    required?: boolean;
    options?: string[];
  }
  
  export type MenuActionType = 'message' | 'link' | 'image' | 'location' | 'contact';
  
  export interface MenuAction {
    type: MenuActionType;
    title?: string;
    content?: string;
    url?: string;
    button_text?: string;
    path?: string;
    name?: string;
    latitude?: string;
    longitude?: string;
    address?: string;
    phone?: string;
    await_response?: string;
  }
  
  export interface MenuConnection {
    id: string;
    source: string;
    target: string;
    label?: string;
  }
  
  export interface MenuFlow {
    nodes: MenuNode[];
    connections: MenuConnection[];
  }