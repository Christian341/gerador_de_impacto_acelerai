import { analyzeCreative } from './services/geminiService.js';

console.log('🧪 Testing Gemini API directly...\n');

try {
    const result = await analyzeCreative('Teste simples de análise');
    console.log('✅ Success! Result:', JSON.stringify(result, null, 2));
} catch (error) {
    console.error('❌ Error occurred:');
    console.error('Message:', error.message);
    console.error('Full error:', error);

    // Check if it's a Gemini API error
    if (error.message.includes('Quota') || error.message.includes('429') || error.message.includes('sobrecarregado')) {
        console.log('\n📊 Diagnosis: GEMINI API QUOTA ERROR (429)');
        console.log('The free tier quota has been exceeded.');
        console.log('Solution: Wait ~1 minute or upgrade API plan.');
    } else if (error.message.includes('API Key')) {
        console.log('\n🔑 Diagnosis: API KEY CONFIGURATION ERROR');
    } else {
        console.log('\n⚠️ Diagnosis: OTHER ERROR (not Gemini quota)');
    }
}
