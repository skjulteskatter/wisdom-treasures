<template>
    <body class="terms-layout">
      <LandingNavBar />
      <main>
        <div class="text-container">
            <h2>Terms of purchase</h2>
            <p>Stiftelsen Skjulte Skatters Forlag (SSSF), org.nr. 991 818 081 is the owner of songtreasures.org and songtreasures.app with its associated online store. Our postal address is P.B. 16, 3156 MELSOMVIK, and we can be reached either by post or at support@songtreasures.org.

            The agreement, open purchase, the Right of Withdrawal Act and the Consumer Purchase Act
            for songtreasures.org and songtreasures.app, applies to both the Consumer Purchase Act and the Right of Withdrawal Act apply.

            SongTreasures subscription for access - special terms
            There is no right of withdrawal on a paid SongTreasures subscription. If the customer considers that the product does not meet their expectations, contact customer service at support@songtreasures.org.</p>
            <h3>Payment</h3>
            <p>In the case of the buyer using a credit card or debit card when paying, we reserve the purchase price on the card when ordering. The card is charged at the same time as the subscription is purchased.

            When the purchase has been completed, a subscription is created on the customer and the details used during the purchase are stored for automatic debiting of the customer upon renewal of the subscription.

            Termination of subscription is done through the portal for administering subscriptions. For new periods, the subscription will not be renewed until payment for the period has been received.

            Personal information / processing of personal data
            SSSF takes privacy seriously and is responsible for the processing of the personal information you leave with us. You have full control over how we use your data.

            When you create a user account with us, we will store, for example, name, address, and telephone number to be able to send you your orders, follow up our deliveries and give you good service.

            SSSF works to provide better online services. Therefore, based on your activity in our digital surfaces, we will be able to use your data to improve and develop our services. This is SSSF’s legitimate interest, but if you do not want us to do this, you can opt out of this for songtreasures.app under ‘My Page’.

            You can at any time ask us to delete the personal information SSSF has associated with you. To do this, contact support@songtreasures.org from your registered email address or from a phone number associated with your account.

            According to the Personal Data Act, you have the right to access the information we have registered about you, and if you believe the information is incorrect or irrelevant, you can request a correction or deletion from our customer register. In that case, you can contact us at support@songtreasures.org. We assure you that we will not give personal information about you to others.

            You must be over 18 years of age to shop at songtreasures.app or have parental / guardian permission.</p>
            <h3>Prices</h3>
            <p>All prices include VAT and in Norwegian kroner and must be paid in Norwegian kroner (NOK). We reserve the right to make typographical errors, and reserve the right to change our prices, which will take effect for future purchases.</p>
            <h3>Conflict resolution</h3>
            <p>Complaints should be addressed to the seller within a reasonable time, cf. item Return and Complaint handling, above. The parties shall endeavour to resolve any disputes amicably. If this is not successful, the buyer can contact the Consumer Council for mediation. The Consumer Council is available on telephone 23 400 500 or forbrukerradet.no.
The European Commission`s complaints portal can also be used if you wish to lodge a complaint. This is especially relevant if you are a consumer residing in another EU country. The complaint is submitted here: http://ec.europa.eu/odr.</p>
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
        name: "TermsOfPurchaseView",
        components: { LandingNavBar, LandingFooter }
      })
  
    </script>
    
    <style>
    *{
      margin:0;
      padding:0
    }

    .terms-layout main{
        background:linear-gradient(to bottom, #202D31,#404f54);
        display: flex;
        justify-content: center;
    }
    .text-container{
        width: 85%;
        margin-block: 20vh;
        padding: 8%;
        background-color: white
    }
    .text-container h2{
        font-size: 2.25rem;
        font-weight: bold;
        margin-bottom: 1em
    }
    .text-container h3{
        font-size: 1.5rem;
        font-weight: bold;
        margin-block: 1em
    }
    .text-container p{
        font-size: 1rem
    }
    </style>