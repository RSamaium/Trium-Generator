{
    type: {{type}},
    {{#if required}} required: {{required}}, {{/if}}
    {{#if email}} required: {{required}}, {{/if}}
    {{#if min}} min: {{min}}, {{/if}}
    {{#if max}} max: {{max}}, {{/if}}
    {{#if match}} match: /{{match}}/, {{/if}}
    {{#if default}} default: "{{default}}", {{/if}}
    {{#if isPassword}} hash: true, {{/if}}
    {{#if validates.length}} 
        validate: []
             {{#each validates}}
                .concat(validate.{{this}}())
             {{/each}}
    {{/if}}
    {{#if unique}} unique: {{unique}}, {{/if}}
    {{#if ref}} ref: "{{ref}}", {{/if}}
    {{#if childPath}} childPath: "{{childPath}}", {{/if}}
}

