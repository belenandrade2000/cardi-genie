import React from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_CARD } from '../utils/mutations';
import { removeCardId } from '../utils/localStorage';

import Auth from '../utils/auth';

const SavedCards = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeCard, { error }] = useMutation(REMOVE_CARD);

  const userData = data?.me || {};

  // create function that accepts the card's mongo _id value as param and deletes the card from the database
  const handleDeleteCard = async (cardId) => {
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeCard({
        variables: { cardId },
      });

      // upon success, remove card's id from localStorage
      removeCardId(cardId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing {userData.username}'s cards!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedCards?.length
            ? `Viewing ${userData.savedCards.length} saved ${userData.savedCards.length === 1 ? 'card' : 'cards'
            }:`
            : 'You have no saved cards!'}
        </h2>
        <div>
          <Row>
            {userData.savedCards?.map((card) => {
              return (
                <Col md="4">
                  <Card key={card.cardId} border="dark">
                    {card.image ? (
                      <Card.Img
                        src={card.image}
                        variant="top"
                      />
                    ) : null}
                    <Card.Body>
                      <Card.Title>{card.title}</Card.Title>
                      <Card.Text>{card.description}</Card.Text>
                      <Button
                        className="btn-block btn-danger"
                        onClick={() => handleDeleteCard(card.cardId)}
                      >
                        Delete this Card!
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </Container>
    </>
  );
};

export default SavedCards;