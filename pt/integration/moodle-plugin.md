---
title: Plugin Moodle
description: Arquitetura e implementação do plugin Moodle Gamibot para integração.
---

# Arquitetura do Plugin Moodle

A plataforma Gamibot integra-se com o Moodle através de um plugin local personalizado que gere o envio de webhooks, observação de eventos e integração do chat.

---

## Plugin: `local_gamibot_manager`

### Visão Geral

| Propriedade | Valor |
|-------------|-------|
| **Tipo** | Plugin local |
| **Localização** | `local/gamibot_manager/` |
| **Propósito** | Dispatcher de webhooks para eventos de ficheiros |

---

## Observadores de Eventos

O plugin regista observadores para eventos Moodle para acionar processamento de IA.

### Observador de Upload de Ficheiros

```php
// Ficheiro: local/gamibot_manager/classes/observers.php

class event_observers {
    public static function file_uploaded(\core\event\content_uploaded $event) {
        $data = $event->get_data();
        $context = context::instance_by_id($data['contextid']);
        $course_id = $context->get_course_context()->instanceid;
        
        $webhook_payload = [
            'course_id' => $course_id,
            'module_id' => $data['objectid'],
            'filename' => $data['other']['filename'],
            'file_url' => $this->get_file_download_url($data),
            'mimetype' => $data['other']['mimetype'],
            'timestamp' => time()
        ];
        
        // Enviar para endpoint de ingestão LangFlow
        $this->dispatch_webhook('ingestion', $webhook_payload);
    }
}
```

---

## Pontos de Integração do Chat

### Binding JavaScript

JavaScript personalizado captura mensagens de alunos do módulo de chat Moodle:

```javascript
// Capturar input do chat e enviar para API Gamibot
document.getElementById('chat-input').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = e.target.querySelector('input').value;
    const response = await fetch('/local/gamibot_manager/api/chat.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            course_id: COURSE_ID,
            user_id: USER_ID,
            message: message
        })
    });
    
    const data = await response.json();
    displayResponse(data.reply);
});
```

### Endpoint do Agente LLM

API RESTful que aceita payloads de chat:

```
POST /local/gamibot_manager/api/chat.php
Content-Type: application/json

{
    "course_id": 123,
    "user_id": 456,
    "message": "Resumir tópico: Redes Neurais"
}
```

---

## Configurações do Plugin

Administradores podem configurar o plugin via configurações Moodle:

```php
// Ficheiro: local/gamibot_manager/settings.php

$settings->add(new admin_setting_configtext(
    'local_gamibot_manager/api_endpoint',
    get_string('api_endpoint', 'local_gamibot_manager'),
    get_string('api_endpoint_desc', 'local_gamibot_manager'),
    'https://langflow.example.com/api'
));

$settings->add(new admin_setting_configpasswordunmask(
    'local_gamibot_manager/api_key',
    get_string('api_key', 'local_gamibot_manager'),
    get_string('api_key_desc', 'local_gamibot_manager'),
    ''
));
```

---

## Segurança de Webhooks

Todos os webhooks incluem validação de assinatura HMAC:

```php
function validate_webhook_signature($payload, $signature) {
    $secret = get_config('local_gamibot_manager', 'webhook_secret');
    $expected = hash_hmac('sha256', $payload, $secret);
    
    return hash_equals($expected, $signature);
}
```

---

## Capacidades

```php
// Ficheiro: local/gamibot_manager/db/access.php

$capabilities = [
    'local/gamibot_manager:use_chat' => [
        'captype' => 'read',
        'contextlevel' => CONTEXT_COURSE,
        'archetypes' => [
            'student' => CAP_ALLOW,
            'teacher' => CAP_ALLOW,
            'editingteacher' => CAP_ALLOW,
            'manager' => CAP_ALLOW,
        ]
    ],
    'local/gamibot_manager:manage_ingestion' => [
        'captype' => 'write',
        'contextlevel' => CONTEXT_COURSE,
        'archetypes' => [
            'editingteacher' => CAP_ALLOW,
            'manager' => CAP_ALLOW,
        ]
    ],
];
```

---

## Próximos Passos

- [Esquema de Base de Dados](/pt/integration/database) - Tabelas estendidas
- [Fluxos LangFlow](/pt/integration/langflow) - Configuração de fluxos de trabalho
