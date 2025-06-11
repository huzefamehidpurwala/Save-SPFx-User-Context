import { WebPartContext } from "@microsoft/sp-webpart-base";
import axios from "axios";

interface ISendContext {
  productName: string;
  productId: string;
  portalUrl: string;
  absoluteUrl: string;
  tenantDisplayName: string;
  aadTenantId: string;
  aadUserId: string;
  userEmail: string;
  userDisplayName: string;
  userPrincipalName: string;
}

export class SaveUserContextLibrary {
  private sendCtx: ISendContext;
  constructor(ctx: WebPartContext) {
    this.sendCtx = {
      // product info
      productName: "Automated-Workflow", // ctx.manifest.alias ||
      productId: ctx.manifest.id,

      // site info
      portalUrl: ctx.pageContext.legacyPageContext.portalUrl ?? undefined,
      absoluteUrl:
        ctx.pageContext.legacyPageContext.siteAbsoluteUrl ??
        ctx.pageContext.legacyPageContext.webAbsoluteUrl ??
        undefined,

      // tenant info
      tenantDisplayName:
        ctx.pageContext.legacyPageContext.tenantDisplayName ?? undefined,
      aadTenantId: ctx.pageContext.legacyPageContext.aadTenantId ?? undefined,

      // user info
      aadUserId: ctx.pageContext.legacyPageContext.aadUserId ?? undefined,
      userEmail: ctx.pageContext.legacyPageContext.userEmail ?? undefined,
      userDisplayName:
        ctx.pageContext.legacyPageContext.userDisplayName ?? undefined,
      userPrincipalName:
        ctx.pageContext.legacyPageContext.userPrincipalName ?? undefined,
    };
  }

  public sendContext = async (): Promise<void> => {
    try {
      await axios.post("http://localhost:3000/api/user-context", this.sendCtx, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Error saving user context:", err);
    }
  };
}
