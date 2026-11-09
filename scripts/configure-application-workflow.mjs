const API_KEY = process.env.N8N_API_KEY;
const INSTANCE_URL = process.env.N8N_URL || 'https://your-instance.app.n8n.cloud';
const WORKFLOW_ID = 'qoSL3ziWDqIetvYi';

async function configureFinal() {
  try {
    // 1. Fetch current workflow
    console.log('1. Fetching workflow...');
    const getResponse = await fetch(`${INSTANCE_URL}/api/v1/workflows/${WORKFLOW_ID}`, {
      headers: { 'X-N8N-API-KEY': API_KEY }
    });

    const workflow = await getResponse.json();

    // 2. Set node parameters and correct legacy type name: n8n-nodes-base.googleFirebaseFirestore
    console.log('2. Configuring node types to googleFirebaseFirestore and parameters...');
    workflow.nodes.forEach(node => {
      // Re-configure Firestore Search Node
      if (node.name === 'Firestore Search') {
        node.type = 'n8n-nodes-base.googleFirebaseFirestore';
        node.typeVersion = 1;
        node.parameters = {
          "operation": "getMany",
          "collection": "roboticsEnrollments",
          "options": {},
          "filters": {
            "conditions": [
              {
                "key": "parentEmail",
                "value": "={{ $json.payer_email || ($json.body && $json.body.payer_email) || ($json.body && $json.body.resource && $json.body.resource.payer && $json.body.resource.payer.email_address) || ($json.body && $json.body.resource && $json.body.resource.billing_agreement_id) || ($json.resource && $json.resource.payer && $json.resource.payer.email_address) }}"
              },
              {
                "key": "paymentStatus",
                "value": "pending"
              }
            ]
          }
        };
        console.log('Configured "Firestore Search" parameters.');
      }
      
      // Re-configure Firestore Update Status Node
      if (node.name === 'Firestore Update Status') {
        node.type = 'n8n-nodes-base.googleFirebaseFirestore';
        node.typeVersion = 1;
        node.parameters = {
          "operation": "update",
          "collection": "roboticsEnrollments",
          "documentId": "={{ $json.id }}",
          "columns": {
            "mappingMode": "defineBelow",
            "value": {},
            "matchingColumns": [],
            "customHeaders": []
          },
          "fields": [
            "paymentStatus",
            "paypalTransactionId",
            "paidAt"
          ],
          "fieldsValues": {
            "paymentStatus": "paid",
            "paypalTransactionId": "={{ $json.txn_id || ($json.body && $json.body.txn_id) || ($node[\"Webhook\"].json.body && $node[\"Webhook\"].json.body.resource && $node[\"Webhook\"].json.body.resource.id) || ($node[\"Webhook\"].json.resource && $node[\"Webhook\"].json.resource.id) }}",
            "paidAt": "={{ new Date().toISOString() }}"
          }
        };
        console.log('Configured "Firestore Update Status" parameters.');
      }
    });

    const updatePayload = {
      name: workflow.name,
      nodes: workflow.nodes,
      connections: workflow.connections,
      settings: {}
    };

    // 3. Upload updated workflow to n8n
    console.log('3. Uploading updated workflow to n8n...');
    const updateResponse = await fetch(`${INSTANCE_URL}/api/v1/workflows/${WORKFLOW_ID}`, {
      method: 'PUT',
      headers: {
        'X-N8N-API-KEY': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatePayload)
    });

    if (!updateResponse.ok) {
      const text = await updateResponse.text();
      console.error('Failed to update:', updateResponse.status, text);
      return;
    }
    console.log('Workflow successfully updated!');

    // 4. Force reactivation to re-compile
    console.log('4. Deactivating workflow...');
    await fetch(`${INSTANCE_URL}/api/v1/workflows/${WORKFLOW_ID}/deactivate`, {
      method: 'POST',
      headers: { 'X-N8N-API-KEY': API_KEY }
    });

    console.log('5. Activating workflow...');
    const activateRes = await fetch(`${INSTANCE_URL}/api/v1/workflows/${WORKFLOW_ID}/activate`, {
      method: 'POST',
      headers: { 'X-N8N-API-KEY': API_KEY }
    });
    
    if (activateRes.ok) {
      console.log('Workflow is active and fully configured!');
    } else {
      console.error('Failed to activate:', activateRes.status);
    }

  } catch (err) {
    console.error('Error during execution:', err);
  }
}

configureFinal();
