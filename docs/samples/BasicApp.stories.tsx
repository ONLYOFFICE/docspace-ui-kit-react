import type { Meta, StoryObj } from "@storybook/react-vite";

const BasicApp = () => <div>Basic app sample</div>;

const meta: Meta<typeof BasicApp> = {
	title: "Samples/Basic App",
	component: BasicApp,
	tags: ["!autodocs"],
	parameters: {
		controls: { disable: true },
		actions: { disable: true },
	},
};

export default meta;

type Story = StoryObj<typeof BasicApp>;

export const Default: Story = {};
