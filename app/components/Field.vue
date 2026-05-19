<script setup lang="ts">
	defineProps<{
		label?: string;
		value?: string | number | null;
	}>();
</script>

<template>
	<div class="w-full">
		<div v-if="label" class="block font-medium text-default">
			{{ label }}
		</div>

		<div v-if="value" :class="['relative', label && 'mt-1']">
			<div class="relative flex items-center w-full">
				<div
					class="w-full rounded-md border-0 appearance-none placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors px-2.5 py-1.5 text-base/5 gap-1.5 text-highlighted bg-default ring ring-inset ring-accented focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary md:text-sm"
				>
					{{ value ?? "-" }}
				</div>
			</div>
		</div>
	</div>
</template>
