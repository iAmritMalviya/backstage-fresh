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
import {EntityFilterQuery} from '@backstage/catalog-client'
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
        const userProfile = await identityApi.getProfileInfo();
        const user = userProfile.email;
        const topics = await catalogApi.getEntities({
          filter : {
            kind: 'user',
            'spec.profile.email': user,
          }                
        });
       
        const groups = topics.items.flatMap(item => item.relations)
        .filter(relation => relation?.type == 'memberOf')
        .map(relation => relation?.target.name)
     
        console.log('topics', topics, groups)
       
        setUserGroups(groups);
        setLoading(false)

      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    }; 

    fetchUserGroups();
 
  }, []);

  // Filter topics based on user's group membership


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
          ):
          
          'You are part of the ' + userGroups
          
          
          }
        </Grid>
      </Content>
    </Page>
  );
};
