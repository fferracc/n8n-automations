const API_KEY = process.env.N8N_API_KEY;
const INSTANCE_URL = process.env.N8N_URL || 'https://your-instance.app.n8n.cloud';
const WORKFLOW_ID = 'qoSL3ziWDqIetvYi';

async function updateForIPN() {
  try {
    // 1. Fetch current workflow
    console.log('Fetching workflow...');
    const getResponse = await fetch(`${INSTANCE_URL}/api/v1/workflows/${WORKFLOW_ID}`, {
      headers: { 'X-N8N-API-KEY': API_KEY }
    });

    if (!getResponse.ok) {
      console.error('Failed to fetch workflow:', getResponse.status);
      return;
    }

    const workflow = await getResponse.json();

    // 2. Update node parameters to support both IPN and REST Webhooks
    console.log('Updating nodes to support IPN format...');
    workflow.nodes.forEach(node => {
      // Update Firestore Search Node
      if (node.name === 'Firestore Search') {
        node.parameters.filters.conditions[0].value = '={{ $json.body.payer_email || $json.body.resource.payer.email_address || $json.body.resource.billing_agreement_id }}';
        console.log('Updated "Firestore Search" node filter expression.');
      }
      
      // Update Firestore Update Status Node
      if (node.name === 'Firestore Update Status') {
        node.parameters.fieldsValues.paypalTransactionId = '={{ $json.body.txn_id || $node["Webhook"].json.body.resource.id }}';
        console.log('Updated "Firestore Update Status" node transaction ID expression.');
      }
    });

    // 3. Prepare payload (strip metadata)
    const updatePayload = {
      name: workflow.name,
      nodes: workflow.nodes,
      connections: workflow.connections,
      settings: workflow.settings
    };

    // 4. Update the workflow
    console.log('Uploading updated workflow to n8n...');
    const updateResponse = await fetch(`${INSTANCE_URL}/api/v1/workflows/${WORKFLOW_ID}`, {
      method: 'PUT',
      headers: {
        'X-N8N-API-KEY': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatePayload)
    });

    if (updateResponse.ok) {
      console.log('n8n workflow updated successfully to support IPN!');
      
      // 5. Ensure workflow is Active
      console.log('Re-activating workflow...');
      await fetch(`${INSTANCE_URL}/api/v1/workflows/${WORKFLOW_ID}/activate`, {
        method: 'POST',
        headers: { 'X-N8N-API-KEY': API_KEY }
      });
      console.log('Workflow is active!');
    } else {
      const text = await updateResponse.text();
      console.error('Failed to update workflow:', updateResponse.status, text);
    }

  } catch (err) {
    console.error('Error during execution:', err);
  }
}

updateForIPN();
