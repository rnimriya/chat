import { Bookings, StripeLogs, Leads } from "./db";

// Types for OpenAI Tool Definitions
export interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, unknown>;
      required?: string[];
    };
  };
}

// 1. Tool definitions to pass to OpenAI
export const chatbotTools: ToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "scheduleAppointment",
      description: "Checks availability and schedules calendar appointments with the customer.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "The customer's full name" },
          email: { type: "string", description: "The customer's email address" },
          dateTime: { type: "string", description: "ISO string representing the requested appointment slot (e.g. 2026-06-01T10:00:00Z)" },
          notes: { type: "string", description: "Any notes or description for the appointment" }
        },
        required: ["name", "email", "dateTime"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "generatePaymentLink",
      description: "Generates a Stripe Payment Link dynamically based on the requested product name and optional price tier.",
      parameters: {
        type: "object",
        properties: {
          productName: { type: "string", description: "The name of the product the user wishes to purchase" },
          priceUSD: { type: "number", description: "The price of the product in USD (defaults to standard rate if unknown)" }
        },
        required: ["productName"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "syncCRMLead",
      description: "Syncs customer details (name, email, phone) to HubSpot CRM database.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "The customer's name" },
          email: { type: "string", description: "The customer's email address" },
          phone: { type: "string", description: "The customer's phone number" }
        },
        required: ["name", "email"]
      }
    }
  }
];

// 2. Core Tool Execution runner (Module 1)
export async function executeChatbotTool(
  chatbotId: string,
  sessionId: string,
  toolName: string,
  args: any
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    switch (toolName) {
      case "scheduleAppointment": {
        const { name, email, dateTime, notes } = args;

        // A. Direct Scheduling Integration (Mocking Calendly / Google Calendar)
        console.log(`[MOCK CALENDAR] Initiating Calendly API request for ${email} at ${dateTime}`);
        
        // Mocking External API request with try/catch
        try {
          // In real production, this would do a fetch to Calendly API:
          // const res = await fetch("https://api.calendly.com/scheduled_events", { ... })
          // if (!res.ok) throw new Error("Calendly sync failed");
          
          const booking = Bookings.create({
            chatbotId,
            sessionId,
            name,
            email,
            date: dateTime,
            notes: notes || "",
            calendlyId: `cal_${Math.random().toString(36).substring(7)}`
          });

          return {
            success: true,
            message: `Appointment scheduled successfully for ${name} on ${new Date(dateTime).toLocaleString()}. (Reference ID: ${booking.calendlyId})`,
            data: booking
          };
        } catch (apiError) {
          console.error("Calendly Mock API error:", apiError);
          throw new Error("Calendar service was unable to lock the time slot.");
        }
      }

      case "generatePaymentLink": {
        const { productName, priceUSD } = args;
        const rate = priceUSD || 49; // Default rate if not provided

        // B. In-Chat Checkout (Mocking Stripe API link generation)
        console.log(`[MOCK STRIPE] Generating Stripe checkout session for product: ${productName} ($${rate})`);

        try {
          // In real production, this would call stripe:
          // const session = await stripe.checkout.sessions.create({ ... })
          const mockPaymentLink = `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substring(20)}?product=${encodeURIComponent(productName)}&amount=${rate}`;
          
          const logEntry = StripeLogs.create({
            chatbotId,
            sessionId,
            stripeLink: mockPaymentLink,
            amount: rate,
            status: "pending"
          });

          return {
            success: true,
            message: `Generated custom payment link for "${productName}" ($${rate} USD). Link: ${mockPaymentLink}`,
            data: { paymentLink: mockPaymentLink, ...logEntry }
          };
        } catch (stripeError) {
          console.error("Stripe Mock API error:", stripeError);
          throw new Error("Stripe payment link server is currently unreachable.");
        }
      }

      case "syncCRMLead": {
        const { name, email, phone } = args;

        // C. CRM Entry Integration (Mocking HubSpot Webhook API)
        console.log(`[MOCK HUBSPOT] Pushing new contact to HubSpot HubSpot CRM API list: ${name} (${email})`);

        try {
          // Mock HubSpot sync
          // await fetch("https://api.hubapi.com/crm/v3/objects/contacts", { method: "POST", headers, body })
          const mockHubspotResponse = { hs_object_id: `hs_${Math.random().toString(36).substring(7)}`, status: "synced" };
          
          // Also save/update the Lead contact in our local database
          Leads.create({
            chatbotId,
            sessionId,
            name,
            email,
            phone: phone || "",
            budget: "Extracted via CRM Entry tool",
            company: "Auto-synced via HubSpot",
            useCase: "Agent Action Tool"
          });

          return {
            success: true,
            message: `CRM contact created for ${name}. HubSpot ID: ${mockHubspotResponse.hs_object_id}`,
            data: mockHubspotResponse
          };
        } catch (crmError) {
          console.error("HubSpot Mock API error:", crmError);
          throw new Error("CRM service refused connection. lead saved locally.");
        }
      }

      default:
        return { success: false, message: `Tool ${toolName} is not recognized.` };
    }
  } catch (err: any) {
    console.error(`Error executing tool ${toolName}:`, err);
    return {
      success: false,
      message: `Failed to complete requested action. Error: ${err.message || err}. Please try again shortly.`
    };
  }
}
