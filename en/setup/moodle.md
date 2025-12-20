---
title: Moodle Setup
description: How to install and configure GamiBot on Moodle.
---

# Moodle Setup

GamiBot has been designed to work with **Moodle 4.2 or higher**. If you are using an older version of Moodle, you will need to upgrade to a compatible version before installing GamiBot.

GamiBot requires two plugins to be installed in your Moodle instance:

- **GamiBot Manager Plugin** - This is a local plugin that is used to manage the GamiBot instance.
- **GamiBot Chat Plugin** - This is a block plugin that is used to display the chat interface.

---

## GamiBot Manager Plugin

### Installation

To install the GamiBot Manager plugin, follow these steps:

1. Download the Manager Plugin from [GamiBot Manager Plugin](/downloads/moodle-local_gamibot_manager.zip).
2. Log in to your Moodle site as an administrator.
3. Navigate to **Site administration** > **Plugins** > **Install plugins**, select the downloaded plugin, and upload it.
4. Click on **Install plugin from the ZIP file**.
5. Follow the on-screen instructions to complete the installation.

### Configuration

Start by configuring the basic settings of the GamiBot Manager Plugin by navigating to **Site administration** > **Plugins** > **Local plugins** > **GamiBot Manager** > **Basic Settings**.

Most of the settings are pre-filled with default values that should work for most use cases. However, you may need to adjust some of the settings based on your specific requirements. 

The first setting relates to the navigation.

- **Add navigation entry** - This option adds a new navigation entry to the primary navigation for administrators, allowing them to manage the GamiBot instance. You can disable this option after the initial setup if you do not want to add a navigation entry to the primary navigation.

The next two settings are related to all calls to external services.

- **Verify SSL certificates** - This option verifies the SSL certificates of all requests to external services (e.g., Gami API endpoint, LangFlow endpoint). You can disable this option if you are using a self-hosted Gami API instance or LangFlow instance.

- **Timeout for requests** - This option sets the timeout for requests to the Gami API endpoint and LangFlow endpoint. The default value is 60 seconds.

The next settings are related to the Gami API. If you intend to use CIP/INOV-Norte's server, please ask us credentials to connect to it (see [Request Credentials](/en/setup/request-credentials)).

- **Gami API endpoint** - This is the URL of the Gami API. The default value points to CIP/INOV-Norte's Gami API instance.
- **Gami API secret** - This is the API key that you will use to authenticate with the Gami API. If you intend to use CIP/INOV-Norte's server, please ask us credentials to connect to it (see [Request Credentials](/en/setup/request-credentials)).

Note: If you are using a self-hosted Gami API instance, check **Gamification > Self-hosting** (coming soon) for more information.

The next settings are related to the data ingestion process. If you intend to use CIP/INOV-Norte's server, please ask us credentials to connect to it (see [Request Credentials](/en/setup/request-credentials)).

- **Ingestion endpoint** - This is the URL of the data ingestion API. The default value points to CIP/INOV-Norte's data ingestion API instance.
- **Webhook secret** - This is the secret that you will use to authenticate with the data ingestion API. If you intend to use CIP/INOV-Norte's server, please ask us credentials to connect to it (see [Request Credentials](/en/setup/request-credentials)). **You need to fill-in this field** with the secret that you will receive from us.

The last setting in **Basic Settings** is the **Number of questions** that should be included in a quiz. The default value is 5.

After making the necessary changes, click on **Save changes** to save the configuration.

---

After configuring the **Basic Settings**, you can now configure the **Tools/Chat Modes**. For this, navigate to **Gamibot tools administration** in the main menu.

There are three tools/chat modes available:

- **Langflow - Clarify** - This tool/chat mode allows users to ask questions about course contents to the GamiBot instance and receive responses.
- **Langflow - Summarize** - This tool/chat mode allows users to request summaries of course contents to the GamiBot instance and receive responses.
- **Langflow - Quiz** - This tool/chat mode allows users to request quizzes about course contents to the GamiBot instance, send their answers and receive feedback about their performance and how they can improve.

Each tool/chat mode can be configured independently. The available settings are:

- **Internal identifier** - This is the internal identifier of the tool/chat mode. It is used to identify the tool/chat mode.
- **GamiBot tool** - This is the GamiBot tool that will be used (only Langflow is available at the moment).
- **API endpoint** - This is the API endpoint of the LangFlow's flow that will be used. By default, it points to CIP/INOV-Norte's LangFlow's flow API endpoint.
- **API key** - This is the API key of the LangFlow instance that will be used to authenticate with the LangFlow endpoint. If you intend to use CIP/INOV-Norte's server, please ask us credentials to connect to it (see [Request Credentials](/en/setup/request-credentials)). **You need to fill-in this field** with the API key that you will receive from us.
- **Domain field ID** - This is the ID of the input field that is used to pass the Moodle domain for filtering the course contents. 
- **Course ID field ID** - This is the ID of the input field that is used to pass the course ID for filtering the course contents. 
- **Additional field ID (e.g., for quizzes, the number of questions field ID)** - This is the ID of the input field that is used to pass the additional field for filtering the course contents or other purposes. 

Note: If you are using a self-hosted LangFlow instance, check **Workflows > Self-hosting** (coming soon) for more information.

---

## GamiBot Chat Plugin

### Installation

To install the GamiBot Chat plugin, follow these steps:

1. Download the Chat Plugin from [GamiBot Chat Plugin](/downloads/moodle-blocks_gamibot.zip).
2. Log in to your Moodle site as an administrator.
3. Navigate to **Site administration** > **Plugins** > **Install plugins**, select the downloaded plugin, and upload it.
4. Click on **Install plugin from the ZIP file**.
5. Follow the on-screen instructions to complete the installation.


### Configuration

To configure the GamiBot Chat plugin, navigate to **Site administration** > **Plugins** > **Blocks** > **GamiBot Chat**.

The available settings are:

- **Pagetypes on which the chat bot floating button should be shown** - This is the pagetypes on which the chat bot floating button should be shown. Insert a list of page types (one string per line) on which the floating button should be shown. It is recommended to insert `*` to always show the block.
- **Replace help button with block_gamibot button** - Select this option to replace the help button with the GamiBot floating button. 
- **Color theme** - This is the color theme of the GamiBot chat. There are three options: `Blue`, `Purple` and `Green`.

After making the necessary changes, click on **Save changes** to save the configuration.

---

## Enabling the GamiBot Chat Plugin

GamiBot Chat is disabled by default in all courses. To enable it, navigate to the course page, click on **Settings**, go to the **GamiBot functionalities** section, and enable the **Add a GamiBot Chat to this course** option.

Finally, click on **Save and display** to save the configuration.
