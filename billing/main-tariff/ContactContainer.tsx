import { observer } from "mobx-react";
import type { TTranslation } from "../../utils/common";
import { Text } from "../../components/text";
import { Link } from "../../components/link";

import { usePaymentStore } from "../store/PaymentStoreProvider";
import styles from "./MainTariff.module.scss";

const ContactContainer = observer(({ t }: { t: TTranslation }) => {
	const paymentStore = usePaymentStore();
	const { salesEmail } = paymentStore;

	return (
		<div className={styles.contactContainer}>
			{salesEmail ? (
				<Text as="span" fontWeight={600}>
					{t("ContactUs")}
					<Link
						className="sales-email-link"
						tag="a"
						fontWeight="600"
						href={`mailto:${salesEmail}`}
						color="accent"
						dataTestId="sales_email_link"
					>
						{salesEmail}
					</Link>
				</Text>
			) : null}
		</div>
	);
});

export default ContactContainer;
