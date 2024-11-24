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
    create: (content: T) => T;
    update: (id: string, updates: Partial<T>) => T;
    delete: (id: string) => boolean;
    findById: (id: string) => T | undefined;
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

// "База даних" для зберігання контенту
const articlesDatabase: Versioned<Article>[] = [];

// Базові операції над статтями
const versionedArticleOperations: ContentOperations<Versioned<Article>> = {
    create: (content) => {
        const newContent = {
            ...content,
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
        };
        articlesDatabase.push(newContent);
        return newContent;
    },
    update: (id, updates) => {
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
    delete: (id) => {
        const index = articlesDatabase.findIndex((article) => article.id === id);
        if (index === -1) return false;
        articlesDatabase.splice(index, 1);
        return true;
    },
    findById: (id) => {
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
        create: (content) => {
            if (!checkPermission('admin', 'create', accessControl)) {
                throw new Error('Permission denied: Cannot create content.');
            }
            return baseOperations.create(content);
        },
        update: (id, updates) => {
            if (!checkPermission('editor', 'update', accessControl)) {
                throw new Error('Permission denied: Cannot update content.');
            }
            return baseOperations.update(id, updates);
        },
        delete: (id) => {
            if (!checkPermission('admin', 'delete', accessControl)) {
                throw new Error('Permission denied: Cannot delete content.');
            }
            return baseOperations.delete(id);
        },
        findById: (id) => {
            if (!checkPermission('viewer', 'read', accessControl)) {
                throw new Error('Permission denied: Cannot read content.');
            }
            return baseOperations.findById(id);
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

try {
    const adminCreatedArticle = restrictedVersionedArticleOperations.create({
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

    // Оновлення статті
    const updatedArticle = restrictedVersionedArticleOperations.update('1', { title: 'Updated Admin Article' });
    console.log('Updated Article:', updatedArticle);

    // Видалення статті
    const isDeleted = restrictedVersionedArticleOperations.delete('1');
    console.log('Is Article Deleted:', isDeleted);

    // Спроба доступу до видаленої статті
    const deletedArticle = restrictedVersionedArticleOperations.findById('1');
    console.log('Deleted Article (should be undefined):', deletedArticle);
} catch (error) {
    if (error instanceof Error) {
        console.error('Error:', error.message);
    } else {
        console.error('Unknown error:', error);
    }
}

try {
    const viewerAttempt = restrictedVersionedArticleOperations.create({
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft',
        title: 'Viewer Attempt Article',
        body: 'This is an article created by a viewer.',
        author: 'Viewer User',
        version: 1,
    });
    console.log('Viewer Created Article:', viewerAttempt);
} catch (error) {
    if (error instanceof Error) {
        console.error('Viewer Error:', error.message);
    } else {
        console.error('Unknown error:', error);
    }
}

try {
    const foundArticle = restrictedVersionedArticleOperations.findById('1');
    console.log('Found Article:', foundArticle);
} catch (error) {
    if (error instanceof Error) {
        console.error('Read Error:', error.message);
    } else {
        console.error('Unknown error:', error);
    }
}
