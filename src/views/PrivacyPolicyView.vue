<template>
    <body class="terms-layout">
      <LandingNavBar />
      <main>
        <div class="text-container">
          <h2>Privacy statement</h2>
          <p>This privacy statement applies to the collection and use of personal information in connection with songtreasures.org and songtreasures.app and the online store. Below you will find information about the purpose of collecting personal information, what information is collected, who gains access to it, information about security, and about what rights you have.

          Stiftelsen Skjulte Skatters Forlag, organization number 991 818 081 (hereinafter «we» or «SSSF») is responsible for the processing of your personal data. See separate point for contact information.</p>
          <h3>Purpose</h3>
          <p>We use the information about you to complete orders you make and to be able to answer any questions you may have to SSSF.

          If you have agreed to this, we will also use them to send you news and offers.

          We use the information we have about you for the following:

          To manage your customer relationship and subscription
          To deliver goods and services that have been ordered
          To be able to answer your inquiries to SSSF
          To give you offers and communication in line with the consents you have given
          To improve and develop our services</p>
          <h3>What personal information do we process?</h3>
          <p>We collect and process the information you provide when registering and ordering, purchase and order history, your response to communications from us and activity on our websites. We do not process sensitive personal information about you in our systems.

          We collect and process the following information about you as a customer:

          Name, address, email, phone number and date of birth.
          Your response to general campaigns, emails, text messages
          History of membership, subscriptions, orders and purchases, as well as activity on our websites.
          By purchasing and / or subscribing to SongTreasures, you agree to abide by the guidelines for private use. You also agree to abide by SSSF’s Copyright Guidelines and Copyright Information. For use in all contexts other than for private, personal use, SSSF must be contacted in writing via forlaget@skjulte-skatter.no. You also agree that SSSF may contact you via the contact information you have provided to us.

          Purchase history is kept for five years. After that, your details are deleted.</p>
          <h3>Who has access to your personal information?</h3>
          <p>Only SSSF employees who need to process your information have access to it. Your data is handled according to today’s strict security requirements.

          We have procedures for internal control to ensure correct handling and security of personal information. The personal information is processed in several IT systems, all of which have strict requirements for information security. All access to the systems is access-controlled, and only employees who will work with the information will have access to it.</p>
          <h3>Who processes your personal data (data processors)</h3>
          <p>SSSF is responsible for processing. We retain all information internally and do not pass it on to third parties, unless they work on behalf of SSSF, and within the framework of the described purposes.

          We will not share or disclose personal information in any way other than as described in our privacy statement unless we are legally obligated to do so or obtain your consent.

          Partners will only have access to the information if this is necessary to perform services for us. In such cases, data processor agreements are entered into which limit their opportunity to use the information.

          In the event of suspicion of an offense or fraud, information may be disclosed to public authorities upon request. The accounts for SSSF are kept internally and audited by a publicly approved auditor.

          Stiftelsen Skjulte Skatters Forlag is a data processor for customers of the online store.</p>
          <h3>Access to personal information</h3>
          <p>You have the right to access the personal information we have about you. You also have the right to rectify, to omit or limited use, as well as to transfer them to yourself or another data controller.

          If you have any questions about our processing of personal data or believe that we do not fulfill our obligations to you regarding how we process your personal data, we encourage you to contact us. See separate point for contact information.

          You also have the right to complain to the Data Inspectorate:<br>
          The Data Inspectorate<br>
          PO Box 8177<br>
          0034 Oslo<br>
          E-mail: postkasse@datatilsynet.no<br>
          Phone: 22 39 69 00</p>
          <h3>Deletion of personal information</h3>
          <p>Through the Accounting Act with regulations, we are required to store information for a minimum of 5 years but delete all information about you at the latest when your customer relationship has been passive for five years. You can, of course, within the framework of the statutory processing of personal data request that we delete information about you before this, or in the event of termination of subscription.

          If you want the personal information about you deleted, please contact us at support@songtreasures.org Your customer relationship is considered passive after the subscription has ended.

          Contact information
          Stiftelsen Skjulte Skatters Forlag (SSSF), org.nr. 991 818 081
          PO Box 16
          N-3156 MELSOMVIK
          Norway
          Email: support@songtreasures.org

          If you have questions about how we process your personal information, you can contact us at the e-mail address: support@songtreasures.org. Mark the inquiry «Personal information».</p>
          <h3>Changes</h3>
          <p>We may change the content of the terms of consent and privacy statement. If the changes require new consent from you, you will be asked to do so when you log in.<br>July 18, 2021</p>
        
        </div>
      </main>
      <LandingFooter class="terms-footer"/>
    </body>
  </template>
    
    <script lang="ts">
    import { defineComponent } from 'vue';
    import LandingNavBar from '@/components/LandingNavBar.vue';
    import LandingFooter from '@/components/LandingFooter.vue';
  
  
      export default defineComponent({
        name: "PrivacyPolicy",
        components: { LandingNavBar, LandingFooter }
      })
  
    </script>
    
    <style>
    *{
      margin:0;
      padding:0
    }
    </style>