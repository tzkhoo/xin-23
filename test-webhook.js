// Test script to verify n8n webhook connection
const testWebhook = async () => {
  try {
    console.log('Testing n8n webhook connection...');
    
    const response = await fetch('https://wonder1.app.n8n.cloud/webhook/fba04990-5cf3-4e19-af50-0743b8319253/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, this is a test message',
        mode: 'general',
        timestamp: new Date().toISOString(),
        user_id: 'test_user_' + Date.now()
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('Success! Response data:', data);
    } else {
      const errorText = await response.text();
      console.error('Error response:', errorText);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

testWebhook();
