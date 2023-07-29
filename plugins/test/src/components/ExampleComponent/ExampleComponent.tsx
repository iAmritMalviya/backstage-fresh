import React, { useEffect, useState } from 'react';
import { Typography, Grid } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  UserIdentity,
} from '@backstage/core-components';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import { EntityOwnerFilter,getEntityRelations, catalogApiRef } from '@backstage/plugin-catalog-react';

export const ExampleComponent = () => {
  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);
  const [userGroups, setUserGroups] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const userProfile = await identityApi.getProfile();
        const groups = userProfile.groups ?? [];
        console.log('groups', groups)
        setUserGroups(groups);

      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    const fetchTopics = async () => {
      try {
        const topics = await catalogApi.getEntities({filter: 'user'});
        console.log('topics', topics)
        setTopics(topics.items);
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGroups();
    fetchTopics();
  }, []);

  // Filter topics based on user's group membership
  const filteredTopics = topics.filter((topic) => {
    const allowedGroups = topic?.metadata?.annotations?.['backstage.io/allowed-groups']?.split(',') ?? [];
    return userGroups.some((group) => allowedGroups.includes(group));
  });

  return (
    <Page themeId="tool">
      <Header title="RedPanda Topics" subtitle="Your topics and brokers">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="RedPanda Topics">
          <SupportButton>
            View the topics and brokers created by your team.
          </SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          {loading ? (
            <Grid item>
              <Typography variant="body1">Loading...</Typography>
            </Grid>
          ) : userGroups.length === 0 ? (
            <Grid item>
              <Typography variant="body1">
                You are not part of any team. Please join a team to access topics
                and brokers.
              </Typography>
            </Grid>
          ) : filteredTopics.length === 0 ? (
            <Grid item>
              <Typography variant="body1">No topics found for your team.</Typography>
            </Grid>
          ) : (
            filteredTopics.map((topic) => (
              <Grid item key={topic.metadata.name}>
                <InfoCard title={topic.metadata.name}>
                  <Typography variant="body1">
                    Topic details...
                  </Typography>
                </InfoCard>
              </Grid>
            ))
          )}
        </Grid>
      </Content>
    </Page>
  );
};
