# Save-SPFx-User-Context

### Version

![node@22.11.0](https://img.shields.io/badge/node-22.11.0-green.svg)

# Use this server

### Call this function in 'onInit' method

```typescript
// this api call is to save the user context in the PSSPL database
sendContext(this.context, "").catch(() => {});
```

### Define this function

```typescript
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface ISendCtx {
  productName: string | undefined;
  productId: string | undefined;
  portalUrl: string | undefined;
  absoluteUrl: string | undefined;
  tenantDisplayName: string | undefined;
  aadTenantId: string | undefined;
  aadUserId: string | undefined;
  userEmail: string | undefined;
  userDisplayName: string | undefined;
  userPrincipalName: string | undefined;
}

/**
 *
 * @param ctx WebPartContext from SPFx
 * @param prdName (optional) Product name to be sent, defaults to the web part alias
 */
const sendContext = async (
  ctx: WebPartContext,
  prdName?: string
): Promise<void> => {
  const sendCtx: ISendCtx = {
    // product info
    productName: prdName ?? ctx.manifest.alias,
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

  try {
    await fetch("https://<domain-name>/api/user-context", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Manually stringify the request body for fetch
      body: JSON.stringify(sendCtx),
    });
  } catch (err) {
    // console.error("Error saving user context:", err);
  }
};

export default sendContext;
```
