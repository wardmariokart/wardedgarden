<template>
	<div class="home">
		<p>hello world</p>
		<h1>{{ title }}</h1>
		<p>{{ description }}</p>
		<div class="features">
			<div v-for="(feature, index) in features" :key="index" class="feature">
				<h3>{{ feature.title }}</h3>
				<p>{{ feature.description }}</p>
			</div>
		</div>
		<button @click="incrementCount">Clicks: {{ count }}</button>
	</div>
</template>

<script>
export default {
	name: 'HomePage',
	// Using data() function for state that works with SSR
	data() {
		return {
			title: 'Welcome to Your Vue SSR App',
			description: 'A server-side rendered Vue application with Express',
			count: 0,
			features: [
				{
					title: 'Server-Side Rendering',
					description: 'Faster initial page loads and improved SEO'
				},
				{
					title: 'Vue 3 Composition API',
					description: 'Build powerful, reusable components'
				},
				{
					title: 'Express Integration',
					description: 'Full control over your server implementation'
				}
			]
		}
	},
	// Methods will work after hydration on the client
	methods: {
		incrementCount() {
			this.count++
		}
	}
}
</script>

<style scoped>
.home {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
	font-family: Arial, sans-serif;
}

h1 {
	color: #42b883;
	text-align: center;
}

.features {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 20px;
	margin-top: 40px;
}

.feature {
	padding: 20px;
	border-radius: 8px;
	background-color: #f5f5f5;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
	margin-top: 30px;
	padding: 10px 20px;
	background-color: #42b883;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 16px;
}

button:hover {
	background-color: #3aa876;
}
</style>