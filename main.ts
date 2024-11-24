interface BaseContent {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    status: 'draft' | 'published' | 'archived';
}

interface Article extends BaseContent {
    title: string;
    body: string;
    author: string;
}

interface Product extends BaseContent {
    name: string;
    description: string;
    price: number;
    inStock: boolean;
}

type Role = 'admin' | 'editor' | 'viewer';

type Permission = {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
};

type AccessControl<T extends BaseContent> = {
    [role in Role]: Permission;
};

type ContentOperations<T extends BaseContent> = {
    create: (role: Role, content: T) => T;
    update: (role: Role, id: string, updates: Partial<T>) => T;
    delete: (role: Role, id: string) => boolean;
    findById: (role: Role, id: string) => T | undefined;
};

type ValidationResult = {
    isValid: boolean;
    errors?: string[];
};

type Validator<T> = {
    validate: (data: T) => ValidationResult;
};

type Versioned<T extends BaseContent> = T & {
    version: number;
};

const articlesDatabase: Versioned<Article>[] = [];

const versionedArticleOperations: ContentOperations<Versioned<Article>> = {
    create: (role, content) => {
        const newContent = {
            ...content,
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
        };
        articlesDatabase.push(newContent);
        return newContent;
    },
    update: (role, id, updates) => {
        const existingArticle = articlesDatabase.find((article) => article.id === id);
        if (!existingArticle) {
            throw new Error(`Article with id "${id}" not found.`);
        }
        const updatedArticle = {
            ...existingArticle,
            ...updates,
            updatedAt: new Date(),
            version: existingArticle.version + 1,
        };
        const index = articlesDatabase.findIndex((article) => article.id === id);
        articlesDatabase[index] = updatedArticle;
        return updatedArticle;
    },
    delete: (role, id) => {
        const index = articlesDatabase.findIndex((article) => article.id === id);
        if (index === -1) return false;
        articlesDatabase.splice(index, 1);
        return true;
    },
    findById: (role, id) => {
        return articlesDatabase.find((article) => article.id === id);
    },
};

const articleAccessControl: AccessControl<Article> = {
    admin: { create: true, read: true, update: true, delete: true },
    editor: { create: true, read: true, update: true, delete: false },
    viewer: { create: false, read: true, update: false, delete: false },
};

function createRestrictedOperations<T extends BaseContent>(
    baseOperations: ContentOperations<Versioned<T>>,
    accessControl: AccessControl<T>
): ContentOperations<Versioned<T>> {
    return {
        create: (role, content) => {
            if (!checkPermission(role, 'create', accessControl)) {
                throw new Error('Permission denied: Cannot create content.');
            }
            return baseOperations.create(role, content);
        },
        update: (role, id, updates) => {
            if (!checkPermission(role, 'update', accessControl)) {
                throw new Error('Permission denied: Cannot update content.');
            }
            return baseOperations.update(role, id, updates);
        },
        delete: (role, id) => {
            if (!checkPermission(role, 'delete', accessControl)) {
                throw new Error('Permission denied: Cannot delete content.');
            }
            return baseOperations.delete(role, id);
        },
        findById: (role, id) => {
            if (!checkPermission(role, 'read', accessControl)) {
                throw new Error('Permission denied: Cannot read content.');
            }
            return baseOperations.findById(role, id);
        },
    };
}

function checkPermission(role: Role, action: keyof Permission, accessControl: AccessControl<BaseContent>): boolean {
    return accessControl[role]?.[action] || false;
}

const versionedArticleAccessControl: AccessControl<Article> = {
    admin: { create: true, read: true, update: true, delete: true },
    editor: { create: true, read: true, update: true, delete: false },
    viewer: { create: false, read: true, update: false, delete: false },
};

const restrictedVersionedArticleOperations = createRestrictedOperations(
    versionedArticleOperations,
    versionedArticleAccessControl
);

// "База даних" для зберігання продуктів
const productsDatabase: Versioned<Product>[] = [];

// Базові операції над продуктами
const versionedProductOperations: ContentOperations<Versioned<Product>> = {
    create: (role, content) => {
        const newContent = {
            ...content,
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
        };
        productsDatabase.push(newContent);
        return newContent;
    },
    update: (role, id, updates) => {
        const existingProduct = productsDatabase.find((product) => product.id === id);
        if (!existingProduct) {
            throw new Error(`Product with id "${id}" not found.`);
        }
        const updatedProduct = {
            ...existingProduct,
            ...updates,
            updatedAt: new Date(),
            version: existingProduct.version + 1,
        };
        const index = productsDatabase.findIndex((product) => product.id === id);
        productsDatabase[index] = updatedProduct;
        return updatedProduct;
    },
    delete: (role, id) => {
        const index = productsDatabase.findIndex((product) => product.id === id);
        if (index === -1) return false;
        productsDatabase.splice(index, 1);
        return true;
    },
    findById: (role, id) => {
        return productsDatabase.find((product) => product.id === id);
    },
};

// Налаштування доступу для продуктів
const productAccessControl: AccessControl<Product> = {
    admin: { create: true, read: true, update: true, delete: true },
    editor: { create: true, read: true, update: true, delete: false },
    viewer: { create: false, read: true, update: false, delete: false },
};

// Створення обмежених операцій для продуктів
const restrictedVersionedProductOperations = createRestrictedOperations(
    versionedProductOperations,
    productAccessControl
);

try {
    const adminCreatedProduct = restrictedVersionedProductOperations.create('admin', {
        id: 'p1',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft',
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 100,
        inStock: true,
        version: 1,
    });
    console.log('Admin Created Product:', adminCreatedProduct);

    const updatedProduct = restrictedVersionedProductOperations.update('admin', 'p1', { price: 120 });
    console.log('Updated Product:', updatedProduct);

    const foundProduct = restrictedVersionedProductOperations.findById('admin', 'p1');
    console.log('Found Product:', foundProduct);

    const isDeleted = restrictedVersionedProductOperations.delete('admin', 'p1');
    console.log('Is Product Deleted:', isDeleted);

    const afterDeletion = restrictedVersionedProductOperations.findById('admin', 'p1');
    console.log('After Deletion (should be undefined):', afterDeletion);
} catch (error) {
    if (error instanceof Error) {
        console.error('Error:', error.message);
    } else {
        console.error('Unknown error:', error);
    }
}

try {
    const adminCreatedArticle = restrictedVersionedArticleOperations.create('admin', {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft',
        title: 'Admin Article',
        body: 'This is an article created by admin.',
        author: 'Admin User',
        version: 1,
    });
    console.log('Admin Created Article:', adminCreatedArticle);

    const updatedArticle = restrictedVersionedArticleOperations.update('admin', '1', { title: 'Updated Admin Article' });
    console.log('Updated Article:', updatedArticle);

    const deletedArticle = restrictedVersionedArticleOperations.findById('admin', '1');
    console.log('Deleted Article (should be undefined):', deletedArticle);
} catch (error) {
    if (error instanceof Error) {
        console.error('Error:', error.message);
    } else {
        console.error('Unknown error:', error);
    }
}

// Демонстрація обмежень для ролі 'viewer'

// Спроба створити статтю як 'viewer'
try {
    const viewerCreateArticle = restrictedVersionedArticleOperations.create('viewer', {
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft',
        title: 'Viewer Attempt Article',
        body: 'This is an article created by a viewer.',
        author: 'Viewer User',
        version: 1,
    });
    console.log('Viewer Created Article:', viewerCreateArticle);
} catch (error) {
    if (error instanceof Error) {
        console.error('Viewer Create Error:', error.message);
    } else {
        console.error('Unknown error:', error);
    }
}

// Спроба оновити статтю як 'viewer'
try {
    const viewerUpdateArticle = restrictedVersionedArticleOperations.update('viewer', '1', { title: 'Viewer Updated Title' });
    console.log('Viewer Updated Article:', viewerUpdateArticle);
} catch (error) {
    if (error instanceof Error) {
        console.error('Viewer Update Error:', error.message);
    } else {
        console.error('Unknown error:', error);
    }
}

// Спроба видалити статтю як 'viewer'
try {
    const viewerDeleteArticle = restrictedVersionedArticleOperations.delete('viewer', '1');
    console.log('Viewer Deleted Article:', viewerDeleteArticle);
} catch (error) {
    if (error instanceof Error) {
        console.error('Viewer Delete Error:', error.message);
    } else {
        console.error('Unknown error:', error);
    }
}

// Спроба прочитати статтю як 'viewer' (повинно бути успішно)
try {
    const viewerReadArticle = restrictedVersionedArticleOperations.findById('viewer', '1');
    console.log('Viewer Read Article:', viewerReadArticle);
} catch (error) {
    if (error instanceof Error) {
        console.error('Viewer Read Error:', error.message);
    } else {
        console.error('Unknown error:', error);
    }
}

const isDeleted = restrictedVersionedArticleOperations.delete('admin', '1');
console.log('Is Article Deleted:', isDeleted);

// Аналогічні спроби для продуктів

// Спроба створити продукт як 'viewer'
try {
    const viewerCreateProduct = restrictedVersionedProductOperations.create('viewer', {
        id: 'p2',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft',
        name: 'Viewer Product',
        description: 'Description of Viewer Product',
        price: 200,
        inStock: false,
        version: 1,
    });
    console.log('Viewer Created Product:', viewerCreateProduct);
} catch (error) {
    if (error instanceof Error) {
        console.error('Viewer Create Product Error:', error.message);
    } else {
        console.error('Unknown error:', error);
    }
}

// Спроба оновити продукт як 'viewer'
try {
    const viewerUpdateProduct = restrictedVersionedProductOperations.update('viewer', 'p1', { price: 220 });
    console.log('Viewer Updated Product:', viewerUpdateProduct);
} catch (error) {
    if (error instanceof Error) {
        console.error('Viewer Update Product Error:', error.message);
    } else {
        console.error('Unknown error:', error);
    }
}

// Спроба видалити продукт як 'viewer'
try {
    const viewerDeleteProduct = restrictedVersionedProductOperations.delete('viewer', 'p1');
    console.log('Viewer Deleted Product:', viewerDeleteProduct);
} catch (error) {
    if (error instanceof Error) {
        console.error('Viewer Delete Product Error:', error.message);
    } else {
        console.error('Unknown error:', error);
    }
}

// Спроба прочитати продукт як 'viewer' (повинно бути успішно)
try {
    const viewerReadProduct = restrictedVersionedProductOperations.findById('viewer', 'p1');
    console.log('Viewer Read Product:', viewerReadProduct);
} catch (error) {
    if (error instanceof Error) {
        console.error('Viewer Read Product Error:', error.message);
    } else {
        console.error('Unknown error:', error);
    }
}
