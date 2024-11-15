import { Card, Page, Layout, Text, Spinner, Button } from "@shopify/polaris";
import { useContext } from "react";
import { AuthContext } from "../services/context";
import HomePage2 from "../components/HomePage2/HomePage2";
import { Stack } from "@chakra-ui/react";
import AddSection from "../components/AddSection";
import { ProductsCard } from "../components/ProductsCard";
import { useGetThemes } from "../apiHooks/useThemes";
import ProductMetaFields from "../components/ProductMetaFields";

export default function HomePage() {
  const { isLoading, isAuthenticated, refetchToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      // <Page>
      //   <Layout>
      //     <Layout.Section>
      //       <Card>
      //         <div style={{ textAlign: 'center', padding: '2rem' }}>
      //           <Spinner accessibilityLabel="Loading" size="large" />
      //           <div style={{ marginTop: '1rem' }}>
      //             <Text variant="bodyMd" as="p">
      //               Authenticating...
      //             </Text>
      //           </div>
      //         </div>
      //       </Card>
      //     </Layout.Section>
      //   </Layout>
      // </Page>
      <></>
    );
  }

  if (!isAuthenticated) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Card>
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <Text variant="headingMd" as="h2">
                  Authentication Failed
                </Text>
                <div style={{ marginTop: "1rem" }}>
                  <Button onClick={() => refetchToken()}>
                    Retry Authentication
                  </Button>
                </div>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  // Temporary rendering
  const { data } = useGetThemes();
  console.log("theme DATA==>", data);
  // Temporary rendering

  return (
    <Stack>
      {/* Temporary rendering  */}
      <AddSection />

      <ProductMetaFields />

      <ProductsCard />
      {/* Temprary rendering  */}

      <HomePage2 />
    </Stack>
  );
}
