type BaseProduct = {
    id: number;
    name: string;
    price: number;
    description: string;
};

type Electronics = BaseProduct & {
    category: 'electronics';
    warrantyPeriod: number;
};

type Clothing = BaseProduct & {
    category: 'clothing';
    size: string;
    material: string;
};

type CartItem<T> = {
    product: T;
    quantity: number;
};

// returns product with required ID or undefined if nothing was found
const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
    return products.find(product => product.id === id);
};

// returns products that have price less or equal to maxPrice
const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
    return products.filter(product => product.price <= maxPrice);
};

// adds given amount of product to cart
const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T,
    quantity: number
): CartItem<T>[] => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
        // if product is present then increases its quantity
        existingItem.quantity += quantity;
    } else {
        // if product is not present then adds new element
        cart.push({ product, quantity });
    }
    return cart;
};

// returns overall cost of products in cart
const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

const electronics: Electronics[] = [
    {
        id: 1,
        name: "Телефон",
        price: 10000,
        category: 'electronics',
        description: "Смартфон з великим екраном",
        warrantyPeriod: 12
    }
];

const clothing: Clothing[] = [
    {
        id: 2,
        name: "Футболка",
        price: 500,
        category: 'clothing',
        description: "Зручна футболка для повсякденного носіння",
        size: "M",
        material: "Бавовна"
    }
];

// searching by id
const phone = findProduct(electronics, 1);
console.log("Знайдений товар:", phone);

let cart: CartItem<BaseProduct>[] = [];

//original price
const calculateTotal1 = calculateTotal(cart);
console.log("Загальна вартість кошика:", calculateTotal1);

// adding to cart
if (phone) {
    cart = addToCart(cart, phone, 1);
}

// // adding another product to cart
const shirt = findProduct(clothing, 2);
if (shirt) {
    cart = addToCart(cart, shirt, 3);
}

// calculating cart cost
const calculateTotal2 = calculateTotal(cart);
console.log("Загальна вартість кошика:", calculateTotal2);

// filtering by max price
const affordableProducts = filterByPrice([...electronics, ...clothing], 1000);
console.log("Доступні товари:", affordableProducts);
