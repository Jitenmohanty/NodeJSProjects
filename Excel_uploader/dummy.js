<TableContainer
  style={{ position: "relative" }}
  overflowY={sortedData.length < 5 ? "auto" : "clip"}
  overflowX={sortedData.length < 5 ? "clip" : "clip"}
>
  <Table size="sm">
    <Thead
      style={{
        position: "sticky",
        top: 0,
        backgroundColor: "#05080D",
        zIndex: 1,
      }}
    >
      <Tr>
        <Th style={{ color: "white" }}>Sl</Th>
        <Th style={{ color: "white" }}>
          <Tooltip
            hasArrow
            label={
              <Flex align={"center"} direction={"column"}>
                <Text>Student Id</Text>
                <Text fontSize={"xs"} color={"#2b2a2a"}>
                  Click to view Candidate Details
                </Text>
              </Flex>
            }
            bg="gray.300"
            color="black"
            placement="top"
          >
            <Flex
              alignItems={"center"}
              width={"100%"}
              justify={"space-between"}
            >
              St. Id {getSortIcon("stuId")}
            </Flex>
          </Tooltip>
        </Th>
        {initialPath == "admin_dashboard" && (
          <Th
            style={{
              color: "white",
            }}
          >
            <Flex
              alignItems={"center"}
              width={"100%"}
              justify={"space-between"}
            >
              <Tooltip
                hasArrow
                label={
                  <>
                    <Flex align={"center"}>
                      <Avatar
                        src=""
                        size="sm"
                        name="Display Picture"
                        mr={2}
                        background={"green"}
                        color={"white"}
                      />
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Text
                          fontSize={"sm"}
                          style={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            maxWidth: "180px",
                          }}
                        >
                          Recruiter Name
                        </Text>
                        <Text
                          fontSize={"sm"}
                          color={"#2b2a2a"}
                          style={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            maxWidth: "180px",
                          }}
                        >
                          Employee Id
                        </Text>
                      </Box>
                    </Flex>
                  </>
                }
                bg="gray.300"
                color="black"
                placement="top"
              >
                Recruiter
              </Tooltip>
              {getSortIcon("addedBy.name")}
            </Flex>
          </Th>
        )}
        <Th
          style={{
            color: "white",
          }}
        >
          <Flex alignItems={"center"} width={"100%"} justify={"space-between"}>
            <Tooltip
              hasArrow
              label={
                <>
                  <Flex align={"center"}>
                    <Avatar
                      src=""
                      size="sm"
                      name="Display Picture"
                      mr={2}
                      background={"green"}
                      color={"white"}
                    />
                    <Box
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Text
                        fontSize={"sm"}
                        style={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          maxWidth: "180px",
                        }}
                      >
                        Gender - Candidate Name
                      </Text>
                      <Text
                        fontSize={"sm"}
                        color={"#2b2a2a"}
                        style={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          maxWidth: "180px",
                        }}
                      >
                        Candidate Email
                      </Text>
                    </Box>
                  </Flex>
                  <Text fontSize={"xs"} color={"gray"}>
                    click on mail to mail the candidate directly
                  </Text>
                  <Flex
                    direction={"column"}
                    fontSize={"xs"}
                    color={"gray"}
                    mt={2}
                  >
                    <Text color={"black"}>Gender Details: </Text>
                    <Flex
                      align={"center"}
                      gap={1}
                      background={"black"}
                      p={1}
                      px={2}
                      color={"white"}
                    >
                      <IoMdMale color="#2D9AFE" />
                      <Text>Male, </Text>
                      <IoMdFemale color="#F86CFF" />
                      <Text>Female, </Text>
                      <IoMaleFemale color="#ffd600" />
                      <Text>Other</Text>
                    </Flex>
                  </Flex>
                </>
              }
              bg="gray.300"
              color="black"
              placement="top"
            >
              Candidate
            </Tooltip>
            {getSortIcon("name")}
          </Flex>
        </Th>
        <Th style={{ color: "white" }}>
          <Tooltip
            hasArrow
            label={
              <Flex direction={"column"} fontSize={"xs"}>
                <Flex gap={1} alignItems={"center"}>
                  <IoCall color="black" />
                  <Text fontSize={"xs"}>
                    Phone Number- click to call directly
                  </Text>
                </Flex>
                <Flex gap={1} alignItems={"center"}>
                  <FaWhatsapp color="black" />
                  <Text fontSize={"xs"}>
                    Whatsapp Number- click to msg. directly
                  </Text>
                </Flex>
              </Flex>
            }
            bg="gray.300"
            color="black"
            placement="top"
          >
            Contact
          </Tooltip>
        </Th>
        <Th
          style={{
            color: "white",
            maxWidth: "200px",
          }}
        >
          <Tooltip
            hasArrow
            label={
              <>
                Candidate Skills with his experience in it.
                <Text fontSize={"xs"} color={"gray"} textAlign={"center"}>
                  click on skill to view skills with relavant experience in
                  details.
                </Text>
              </>
            }
            bg="gray.300"
            color="black"
            placement="top"
          >
            Skills
          </Tooltip>
        </Th>
        <Th style={{ color: "white" }}>
          <Tooltip
            hasArrow
            label={
              <>
                <Flex
                  direction={"column"}
                  fontSize={"xs"}
                  borderLeft={"3px solid"}
                  borderColor="green"
                  paddingLeft={1}
                >
                  <Text fontSize={"xs"} fontWeight={"bold"}>
                    Experience Period
                  </Text>
                  <Text fontSize={"xs"}>(Experience Type)</Text>
                </Flex>
                <Box
                  mt={1}
                  paddingLeft={1}
                  borderLeft={"3px solid"}
                  borderColor="red"
                >
                  Fresher
                </Box>
                <Box
                  mt={1}
                  paddingLeft={1}
                  borderLeft={"3px solid"}
                  borderColor="green"
                >
                  Experienced
                </Box>
              </>
            }
            bg="gray.300"
            color="black"
            placement="top"
          >
            Experience
          </Tooltip>
        </Th>
        <Th style={{ color: "white" }}>
          <Tooltip
            hasArrow
            label={
              <Flex direction={"column"} fontSize={"xs"}>
                <Flex gap={1} alignItems={"center"}>
                  <Text fontSize={"xs"}>Current-</Text>
                  <Text fontSize={"xs"} fontWeight={"bold"}>
                    Stipend / CTC
                  </Text>
                </Flex>
                <Text fontSize={"xs"} fontWeight={"bold"}>
                  Expected CTC
                </Text>
              </Flex>
            }
            bg="gray.300"
            color="black"
            placement="top"
          >
            CTC
          </Tooltip>
        </Th>
        <Th style={{ color: "white" }}>
          <Tooltip
            hasArrow
            label="Address- City, State"
            bg="gray.300"
            color="black"
            placement="top"
          >
            Address
          </Tooltip>
        </Th>
        <Th style={{ color: "white" }}>
          <Flex alignItems={"center"} width={"100%"} justify={"space-between"}>
            <Tooltip
              hasArrow
              label="Candidate Status"
              bg="gray.300"
              color="black"
              placement="top"
            >
              Status
            </Tooltip>{" "}
            {getSortIcon("currentStatus")}
          </Flex>
        </Th>
        <Th style={{ color: "white" }}>
          <Flex
            alignItems={"center"}
            width={"100%"}
            justify={"space-between"}
            gap={2}
          >
            <Flex
              alignItems={"center"}
              flexGrow={1}
              justify={"space-between"}
              cursor={"pointer"}
            >
              <Tooltip
                hasArrow
                label="Candidate Added On"
                bg="gray.300"
                color="black"
                placement="top"
              >
                Add
              </Tooltip>{" "}
              {getSortIcon("createdAt")}
            </Flex>
            <Flex
              alignItems={"center"}
              flexGrow={1}
              justify={"space-between"}
              cursor={"pointer"}
            >
              <Tooltip
                hasArrow
                label="Candidate Updated On"
                bg="gray.300"
                color="black"
                placement="top"
              >
                Upd
              </Tooltip>{" "}
              {getSortIcon("updatedAt")}
            </Flex>
          </Flex>
        </Th>
        <Th
          style={{
            color: "white",
          }}
        >
          <Tooltip
            hasArrow
            label='Click on respective "Menu Button" for more options.'
            bg="gray.300"
            color="black"
            placement="top"
            maxW={"200px"}
          >
            <Box>
              <MdMenu />
            </Box>
          </Tooltip>
        </Th>
      </Tr>
    </Thead>
    <Tbody>
      {sortedData &&
        sortedData?.map((candidate, index) => (
          <Tr key={index}>
            <Td>{index + 1}</Td>
            <Td style={{ cursor: "pointer" }}>{candidate?.stuId}</Td>
            {initialPath == "admin_dashboard" && (
              <Td
                style={{
                  maxWidth: "250px",
                  overflow: "hidden",
                }}
              >
                <Flex>
                  <Avatar
                    isLazy
                    src={`${backendUrl}${candidate?.addedBy?.dp}`}
                    size="sm"
                    name={candidate?.addedBy?.name}
                    mr={2}
                    background={"green"}
                    color={"white"}
                  />
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Flex gap={1}>
                      <Text
                        fontSize={"sm"}
                        style={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          maxWidth: "180px",
                        }}
                      >
                        {candidate?.addedBy?.name}
                      </Text>
                    </Flex>
                    <Text
                      fontSize={"sm"}
                      color={"#a3a3a3"}
                      style={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        maxWidth: "180px",
                      }}
                    >
                      {candidate?.addedBy?.empId}
                    </Text>
                  </Box>
                </Flex>
              </Td>
            )}
            <Td
              style={{
                maxWidth: "250px",
                overflow: "hidden",
              }}
            >
              <Flex>
                <Avatar
                  isLazy
                  src={`${backendUrl}${candidate.dp}`}
                  size="sm"
                  name={candidate?.name}
                  mr={2}
                  background={"green"}
                  color={"white"}
                />
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Flex gap={1}>
                    {getGenderIcon(candidate.gender)}
                    <Text
                      fontSize={"sm"}
                      style={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        maxWidth: "180px",
                      }}
                    >
                      {candidate?.name}
                    </Text>
                  </Flex>
                  <Text
                    fontSize={"sm"}
                    color={"#a3a3a3"}
                    style={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      maxWidth: "180px",
                    }}
                  >
                    <a target="_blank" href={`mailto:${candidate?.email}`}>
                      {candidate?.email}
                    </a>
                  </Text>
                </Box>
              </Flex>
            </Td>
            <Td>
              <Flex direction={"column"} fontSize={"xs"}>
                <Flex gap={1} alignItems={"center"}>
                  <a target="_blank" href={`tel:${candidate?.phone}`}>
                    <IoCall color="cyan" />
                  </a>
                  <Text fontSize={"xs"}>
                    <a target="_blank" href={`tel:${candidate?.phone}`}>
                      {candidate?.phone}
                    </a>
                  </Text>
                </Flex>
                <Flex gap={1} alignItems={"center"}>
                  <a
                    target="_blank"
                    href={`https://wa.me/${candidate?.whatsappNo}`}
                  >
                    <FaWhatsapp color="lime" />
                  </a>
                  <Text fontSize={"xs"}>
                    <a
                      target="_blank"
                      href={`https://wa.me/${candidate?.whatsappNo}`}
                    >
                      {candidate?.whatsappNo}
                    </a>
                  </Text>
                </Flex>
              </Flex>
            </Td>
            <Td
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "200px",
              }}
            >
              <Popover>
                <PopoverTrigger>
                  <Text cursor={"pointer"}>
                    {printSkills(candidate?.skills, 25)}
                  </Text>
                </PopoverTrigger>
                <PopoverContent w={"200px"}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Skills</PopoverHeader>
                  <PopoverBody
                    style={{
                      textWrap: "wrap",
                      lineHeight: "normal",
                    }}
                  >
                    {candidate.skills?.map((skill, index) => (
                      <Text
                        key={index}
                      >{`${skill.skillName} - ${skill.relevantExp} Years`}</Text>
                    ))}
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Td>
            <Td>
              <Flex
                direction={"column"}
                fontSize={"xs"}
                borderLeft={"3px solid"}
                borderColor={candidate?.isFresher ? "red" : "green"}
                paddingLeft={1}
              >
                <Text fontSize={"xs"} fontWeight={"bold"}>
                  {candidate?.experience}
                </Text>
                <Text fontSize={"xs"}>({candidate?.experienceType})</Text>
              </Flex>
            </Td>
            <Td>
              <Flex direction={"column"} fontSize={"xs"}>
                <Flex gap={1} alignItems={"center"}>
                  {candidate?.currentCTC ? (
                    <>
                      <Text fontSize={"xs"}>Curr.-</Text>
                      <Text fontSize={"xs"} fontWeight={"bold"}>
                        {convertToLPA(candidate?.currentCTC)}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text fontSize={"xs"}>Stipend-</Text>
                      <Text fontSize={"xs"} fontWeight={"bold"}>
                        ₹ {candidate?.stipend}
                      </Text>
                    </>
                  )}
                </Flex>
                <Flex gap={1} alignItems={"center"}>
                  <Text fontSize={"xs"}>Exp.-</Text>
                  <Text fontSize={"xs"} fontWeight={"bold"}>
                    {convertToLPA(candidate?.expectedCTC)}
                  </Text>
                </Flex>
              </Flex>
            </Td>
            <Td>
              <Flex direction={"column"}>
                <Text fontSize={"xs"}>
                  {candidate?.address?.city}
                  {","}
                </Text>
                <Text fontSize={"xs"}>{candidate?.address?.state}</Text>
              </Flex>
            </Td>
            <Td>
              {candidate?.currentStatus == "Selected" && (
                <Badge variant="subtle" colorScheme="green">
                  Selected
                </Badge>
              )}
              {candidate?.currentStatus == "Processing" && (
                <Badge variant="subtle" colorScheme="blue">
                  Processing
                </Badge>
              )}
              {candidate?.currentStatus == "On Bench" && (
                <Badge variant="subtle" colorScheme="orange">
                  On Bench
                </Badge>
              )}
            </Td>
            <Td style={{ cursor: "pointer" }}>
              <Flex direction={"column"}>
                <Text>{formatDateTime(candidate.createdAt)}</Text>
                <Text fontSize={"sm"} color={"#a3a3a3"}>
                  {formatDateTime(candidate.updatedAt)}
                </Text>
              </Flex>
            </Td>
            <Td>
              <Menu>
                <MenuButton>
                  <GrMore />
                </MenuButton>
                <MenuList minW={"50px"}>
                  <MenuItem>Candidate Details</MenuItem>
                  <MenuItem>Process Candidate</MenuItem>

                  <MenuDivider />

                  <MenuItem color={"#d8a953"}>Update Candidate</MenuItem>
                  <MenuItem color={"#f25c5c"}>Delete Candidate</MenuItem>
                </MenuList>
              </Menu>
            </Td>
          </Tr>
        ))}
    </Tbody>
  </Table>
</TableContainer>;
