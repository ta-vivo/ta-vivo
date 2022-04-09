<template>
  <q-page padding>
    <p class="text-h3 text-center">{{ $t("common.termsAndConditions") }}</p>
    <p>
      Please read these Terms of Service ("Terms", "Terms of Service") carefully
      before using the {{ systemUrl }} website (the "Service") operated by
      {{ appName }} ("us", "we", or "our").
    </p>
    <p>
      Your access to and use of the Service is conditioned on your acceptance of
      and compliance with these Terms. These Terms apply to all visitors, users
      and others who access or use the Service.
    </p>
    <p>
      By accessing or using the Service you agree to be bound by these Terms. If
      you disagree with any part of the terms then you may not access the
      Service.
    </p>
    <p class="text-h5">Self hosted</p>
    <p>
      {{ appName }} provides you with the code to create your own
      implementation, {{ appName }} is not responsible for possible failures,
      functionalities or parts that do not work.
    </p>
    <p class="text-h5">Subscriptions</p>
    <p>
      Some parts of the Service are billed on a subscription basis
      ("Subscription(s)"). You will be billed in advance on a recurring and
      periodic basis ("Billing Cycle"). Billing cycles are set on a monthly
      basis.
    </p>
    <p>
      At the end of each Billing Cycle, your Subscription will automatically
      renew under the exact same conditions unless you cancel it or
      {{ appName }} cancels it. You may cancel your Subscription renewal either
      through your online account management page or by contacting
      {{ appName }} customer support team.
    </p>
    <p>
      A valid payment method, including credit card or PayPal, is required to
      process the payment for your Subscription. You shall provide
      {{ appName }} with accurate and complete billing information including
      full name, address, state, zip code, phone number, and a valid payment
      method information. By submitting such payment information, you
      automatically authorize {{ appName }} to charge all Subscription fees
      incurred through your account to any such payment instruments.
    </p>
    <p>
      Should automatic billing fail to occur for any reason, {{ appName }} will
      issue an electronic invoice indicating that you must proceed manually,
      within a certain deadline date, with the full payment corresponding to the
      billing period as indicated on the invoice.
    </p>
    <p class="text-h5">Fee Changes</p>
    <p>
      {{ appNAme }} will provide you with a reasonable prior notice of any
      change in Subscription fees to give you an opportunity to terminate your
      Subscription before such change becomes effective.
    </p>
    <p class="text-h5">Accounts</p>
    <p>
      When you create an account with us, you must provide us information that
      is accurate, complete, and current at all times. Failure to do so
      constitutes a breach of the Terms, which may result in immediate
      termination of your account on our Service.
    </p>
    <p>
      You are responsible for safeguarding the password that you use to access
      the Service and for any activities or actions under your password, whether
      your password is with our Service or a third-party service.
    </p>
    <p>
      You agree not to disclose your password to any third party. You must
      notify us immediately upon becoming aware of any breach of security or
      unauthorized use of your account.
    </p>
    <p class="text-h5">Intellectual Property</p>
    <p>
      The Service and its original content, features and functionality are and
      will remain the exclusive property of {{ appName }} and its licensors.
    </p>
    <p class="text-h5">Termination</p>
    <p>
      We may terminate or suspend your account immediately, without prior notice
      or liability, for any reason whatsoever, including without limitation if
      you breach the Terms.
    </p>
    <p>
      Upon termination, your right to use the Service will immediately cease. If
      you wish to terminate your account, you may simply discontinue using the
      Service.
    </p>
    <p class="text-h5">Limitation Of Liability</p>
    <p>
      In no event shall {{ appNAme }}, nor its directors, employees, partners,
      agents, suppliers, or affiliates, be liable for any indirect, incidental,
      special, consequential or punitive damages, including without limitation,
      loss of profits, data, use, goodwill, or other intangible losses,
      resulting from (i) your access to or use of or inability to access or use
      the Service; (ii) any conduct or content of any third party on the
      Service; (iii) any content obtained from the Service; and (iv)
      unauthorized access, use or alteration of your transmissions or content,
      whether based on warranty, contract, tort (including negligence) or any
      other legal theory, whether or not we have been informed of the
      possibility of such damage, and even if a remedy set forth herein is found
      to have failed of its essential purpose.
    </p>
    <p class="text-h5">Disclaimer</p>
    <p>
      Your use of the Service is at your sole risk. The Service is provided on
      an "AS IS" and "AS AVAILABLE" basis. The Service is provided without
      warranties of any kind, whether express or implied, including, but not
      limited to, implied warranties of merchantability, fitness for a
      particular purpose, non-infringement or course of performance.
    </p>
    <p>
      {{ appName }} its subsidiaries, affiliates, and its licensors do not
      warrant that
      <br />
      a) the Service will function uninterrupted, secure or available at any
      particular time or location.
      <br />
      b) any errors or defects will be corrected;
      <br />
      c) the Service is free of viruses or other harmful components.
      <br />
      d) The results of using the Service will meet your requirements.
    </p>
    <p class="text-h5">Changes</p>
    <p>
      We reserve the right, at our sole discretion, to modify or replace these
      Terms at any time. If a revision is material we will try to provide at
      least 30 days notice prior to any new terms taking effect. What
      constitutes a material change will be determined at our sole discretion.
    </p>
    <p>
      By continuing to access or use our Service after those revisions become
      effective, you agree to be bound by the revised terms. If you do not agree
      to the new terms, please stop using the Service.
    </p>
    <p class="text-h5">Contact Us</p>
    <p>
      If you have any questions about these Terms, please <a :href="`mailto:${contactEmail}`">contact us</a>.
    </p>
    <q-separator />
    <p class="q-mt-md">
      This document was last updated on April 8, 2022
    </p>
  </q-page>
</template>

<script>
export default {
  name: "PageLegalTermsAndConditions",
  setup() {
    return {
      systemUrl: "https://ta-vivo.do",
      appName: "Ta-Vivo",
      contactEmail: 'contact@ta-vivo.do'
    };
  },
};
</script>
