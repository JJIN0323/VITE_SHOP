import React, { Component } from 'react';
import ProductViewsLineChart from '../../components/ProductViewsLineChart';

export default class AdminPage extends Component {
  state = {
    activePage: '', // 초기에는 아무 페이지도 선택되지 않음
    iframeHeight: '100%', // iframe 높이 기본값
  };

  setActivePage = (page) => {
    console.log('페이지 변경됨:', page);
    this.setState({ activePage: page });
  };

  goToHome = () => {
    window.location.href = '/'; // 홈으로 이동
  };

  renderDefaultMessage = () => {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Select an action from the menu</div>;
  };

  render() {
    const { activePage, iframeHeight } = this.state;

    return (
      <section style={{ borderTop: '1px solid #7f7e7b', display: 'flex', minHeight: '100vh' }}>
        <div
          className="adminSideMenu"
          style={{
            width: '20%',
            padding: '10px',
            borderRight: '1px solid #ddd',
            backgroundColor: '#f9f9f9',
          }}
        >
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li
              style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd' }}
              onClick={() => this.setActivePage('/product/upload')}
            >
              UPLOAD
            </li>
            <li
              style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd' }}
              onClick={() => this.setActivePage('/product/modify')}
            >
              MODIFY
            </li>
            <li
              style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd' }}
              onClick={() => this.setActivePage('/product/delete')}
            >
              DELETE
            </li>
          </ul>
          <div
            className="goTo"
            style={{ cursor: 'pointer', color: '#282828', marginTop: '20px' }}
            onClick={this.goToHome}
          >
            ☞ GO HOME
          </div>
        </div>
        <div className="adminGraph" style={{ width: '80%', padding: '10px' }}>
          {activePage ? (
            <iframe
              src={activePage} // 선택된 페이지의 URL
              title="Admin Content"
              style={{
                width: '100%',
                height: iframeHeight,
                border: 'none',
                backgroundColor: '#fff',
              }}
            />
          ) : (
            <ProductViewsLineChart /> // GRAPH
          )}
        </div>
      </section>
    );
  }
}
