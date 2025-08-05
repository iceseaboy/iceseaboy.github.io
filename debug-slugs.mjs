import { getCollection } from 'astro:content';

const legal = await getCollection('legal');
const support = await getCollection('support');

console.log('Legal collection slugs:');
legal.forEach(entry => {
  console.log(`- ${entry.slug} (file: ${entry.id})`);
});

console.log('\nSupport collection slugs:');
support.forEach(entry => {
  console.log(`- ${entry.slug} (file: ${entry.id})`);
});