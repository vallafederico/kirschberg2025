# Enhanced createPreview Syntax

The `createPreview` utility now supports advanced syntax for field selectors, allowing you to work with arrays, objects, and computed values in a more flexible way.

## Supported Syntax

### Array Indexing
Access specific elements from array fields using bracket notation:

```typescript
// Get the first image from an images array
preview: createPreview("{Gallery}", null, "images[0]")

// Get the second item from a list
preview: createPreview("items[1]", null, null)
```

### Count Function
Get the length of array fields using the `count()` function:

```typescript
// Show the number of items in an array
preview: createPreview("{Items List}", "count(items)", null)

// Use count in any field position
preview: createPreview("count(images)", null, null)
```

### Object Property Access
Access nested properties from object fields using dot notation:

```typescript
// Access a nested title field
preview: createPreview("metadata.title", null, null)

// Access nested properties in any field position
preview: createPreview("user.profile.name", "user.email", null)
```

### Static Values
Use curly braces for static text that doesn't come from fields:

```typescript
// Static title with dynamic subtitle
preview: createPreview("{Custom Title}", "dynamicField", null)
```

## Examples

### Basic Array Usage
```typescript
export default {
  type: "object",
  name: "imageGallery",
  preview: createPreview("{Image Gallery}", "count(images)", "images[0]"),
  fields: [
    {
      name: "images",
      type: "array",
      of: [{ type: "media" }],
    },
  ],
};
```

### Complex Object Access
```typescript
export default {
  type: "object",
  name: "userProfile",
  preview: createPreview("user.name", "user.email", "user.avatar"),
  fields: [
    {
      name: "user",
      type: "object",
      fields: [
        { name: "name", type: "string" },
        { name: "email", type: "string" },
        { name: "avatar", type: "image" },
      ],
    },
  ],
};
```

### Mixed Syntax
```typescript
export default {
  type: "object",
  name: "productList",
  preview: createPreview("metadata.title", "count(products)", "products[0].image"),
  fields: [
    {
      name: "metadata",
      type: "object",
      fields: [
        { name: "title", type: "string" },
      ],
    },
    {
      name: "products",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string" },
            { name: "image", type: "image" },
          ],
        },
      ],
    },
  ],
};
```

## Extending the Syntax

The syntax handler system is modular and can be extended. To add new syntax patterns:

1. Create a new handler in `syntax-handlers.ts`:

```typescript
export const customHandler: SyntaxHandler = {
  name: 'custom',
  pattern: /^custom\((.+)\)$/,
  process: (match, previewParts) => {
    const [, fieldName] = match;
    // Your custom logic here
    return processedValue;
  },
};
```

2. Add it to the handlers array:

```typescript
export const syntaxHandlers: SyntaxHandler[] = [
  customHandler, // Add at the beginning for higher priority
  arrayIndexHandler,
  countHandler,
  objectPropertyHandler,
  defaultHandler,
];
```

## Migration from Old Syntax

The new syntax is backward compatible. Existing schemas will continue to work without changes. To take advantage of the new features, simply update your field selectors:

```typescript
// Old way
preview: createPreview("title", "subtitle", "media")

// New way with array indexing
preview: createPreview("title", "subtitle", "media[0]")

// New way with count
preview: createPreview("title", "count(items)", "media[0]")
```
