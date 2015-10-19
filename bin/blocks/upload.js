uploadFields() {
    return [
        {{#schema obj filter}}
                { name: "{{name}}", maxCount: 1 }
        {{/schema}}
    ]
}

uploadFilter() {
    return {
        {{#schema obj filter}}
                {{name}}: {
                    "images": ["*"]
                }
        {{/schema}}
    }
}