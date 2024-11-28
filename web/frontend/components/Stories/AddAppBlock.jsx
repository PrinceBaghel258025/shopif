import { useContext } from "react";
import { AuthContext } from "../../services/context";
import { Button, HStack, IconButton, Tooltip } from "@chakra-ui/react";
import { FiPlusCircle } from "react-icons/fi";

const AddAppBlock = ({ icon = false }) => {
  const { getShop } = useContext(AuthContext);

  const appBlockId = "dbeabe3c-71db-4d6d-b50f-843a50180683";
  const extensionHandle = "floating";

  const addExtUrl = `https://${getShop()}/admin/themes/current/editor?template=product&addAppBlockId=${appBlockId}/${extensionHandle}&target=newAppsSection`;

  return (
    <>
      {icon ? (
        <Tooltip
          placement="auto-end"
          aria-label="Add Extension Block"
          label="Add Extension Block, To access story features, ensure that your theme includes an
      extension. Without it, these features won't be visible."
        >
          <a href={addExtUrl} target="_blank" style={{ width: "fit-content" }}>
            <IconButton
              icon={<FiPlusCircle color="green" fontSize={20} />}
              borderRadius={"full"}
              bg={"gray.200"}
            />
          </a>
        </Tooltip>
      ) : (
        <HStack position={"relative"} w={"fit-content"}>
          <a href={addExtUrl} target="_blank" style={{ width: "fit-content" }}>
            <Button px={7} py={5}>
              Add Section
            </Button>
          </a>
        </HStack>
      )}
    </>
  );
};

export default AddAppBlock;
