import 'solid-js';

function SidebarComponent({history}: {history: string[]}) {
return (

<aside class="sidebar" aria-label="Sidebar">
	<div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
		<a href="/" class="flex items-center pl-2.5 mb-5">
		<img src="https://flowbite.com/docs/images/logo.svg" class="h-6 mr-3 sm:h-7" alt="RegExp AI generator" />
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">RegExp AI</span>
		</a>
		<ul class="space-y-2 font-medium">
		{history.length === 0 ? (
			<li
			>
			<a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
				<svg aria-hidden="true" class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
				<span class="ml-3">Create prompt</span>
			</a>
			</li>
		) : history.map((query) => (
			<li>
			<a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
				<svg aria-hidden="true" class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
				<span class="ml-3">{query}</span>
			</a>
			</li>
		))}

		</ul>
	</div>
	</aside>
)
}

export default SidebarComponent;