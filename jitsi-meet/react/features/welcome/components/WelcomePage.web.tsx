import React from 'react';
import { connect } from 'react-redux';
import { isMobileBrowser } from '../../base/environment/utils';
import { translate, translateToHTML } from '../../base/i18n/functions';
import Icon from '../../base/icons/components/Icon';
import { IconWarning } from '../../base/icons/svg';
import Watermarks from '../../base/react/components/web/Watermarks';
import getUnsafeRoomText from '../../base/util/getUnsafeRoomText.web';
import CalendarList from '../../calendar-sync/components/CalendarList.web';
import RecentList from '../../recent-list/components/RecentList.web';
import SettingsButton from '../../settings/components/web/SettingsButton';
import { SETTINGS_TABS } from '../../settings/constants';
import { AbstractWelcomePage, IProps, _mapStateToProps } from './AbstractWelcomePage';
import Tabs from './Tabs';
import Navbar from '../../app/components/Navbar';

export const ROOM_NAME_VALIDATE_PATTERN_STR = '^[^?&:\u0022\u0027%#]+$';

class WelcomePage extends AbstractWelcomePage<IProps> {
    _additionalContentRef: HTMLDivElement | null;
    _additionalToolbarContentRef: HTMLDivElement | null;
    _additionalCardRef: HTMLDivElement | null;
    _roomInputRef: HTMLInputElement | null;
    _additionalCardTemplate: HTMLTemplateElement | null;
    _additionalContentTemplate: HTMLTemplateElement | null;
    _additionalToolbarContentTemplate: HTMLTemplateElement | null;
    _titleHasNotAllowCharacter: boolean;

    static defaultProps = {
        _room: ''
    };

    constructor(props: IProps) {
        super(props);

        this.state = {
            ...this.state,
            generateRoomNames: interfaceConfig.GENERATE_ROOMNAMES_ON_WELCOME_PAGE
        };

        this._titleHasNotAllowCharacter = false;
        this._additionalContentRef = null;
        this._roomInputRef = null;
        this._additionalToolbarContentRef = null;
        this._additionalCardRef = null;
        this._additionalCardTemplate = document.getElementById('welcome-page-additional-card-template') as HTMLTemplateElement;
        this._additionalContentTemplate = document.getElementById('welcome-page-additional-content-template') as HTMLTemplateElement;
        this._additionalToolbarContentTemplate = document.getElementById('settings-toolbar-additional-content-template') as HTMLTemplateElement;

        this._onFormSubmit = this._onFormSubmit.bind(this);
        this._onRoomChange = this._onRoomChange.bind(this);
        this._setAdditionalCardRef = this._setAdditionalCardRef.bind(this);
        this._setAdditionalContentRef = this._setAdditionalContentRef.bind(this);
        this._setRoomInputRef = this._setRoomInputRef.bind(this);
        this._setAdditionalToolbarContentRef = this._setAdditionalToolbarContentRef.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
    }

    override componentDidMount() {
        super.componentDidMount();
        document.body.classList.add('welcome-page');
        document.title = interfaceConfig.APP_NAME;

        if (this.state.generateRoomNames) {
            this._updateRoomName();
        }

        if (this._shouldShowAdditionalContent()) {
            this._additionalContentRef?.appendChild(this._additionalContentTemplate?.content.cloneNode(true) as Node);
        }

        if (this._shouldShowAdditionalToolbarContent()) {
            this._additionalToolbarContentRef?.appendChild(this._additionalToolbarContentTemplate?.content.cloneNode(true) as Node);
        }

        if (this._shouldShowAdditionalCard()) {
            this._additionalCardRef?.appendChild(this._additionalCardTemplate?.content.cloneNode(true) as Node);
        }
    }

    override componentWillUnmount() {
        super.componentWillUnmount();
        document.body.classList.remove('welcome-page');
    }

    _onLogoutClick = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        window.location.href = '/';
    };

    // Hàm kiểm tra trạng thái đăng nhập
    _isLoggedIn() {
        const token = localStorage.getItem('access_token');
        return !!token; // True nếu có token, False nếu không
    }

    override render() {
        const { _moderatedRoomServiceUrl, t } = this.props;
        const { DEFAULT_WELCOME_PAGE_LOGO_URL, DISPLAY_WELCOME_FOOTER } = interfaceConfig;
        const showAdditionalCard = this._shouldShowAdditionalCard();
        const showAdditionalContent = this._shouldShowAdditionalContent();
        const showAdditionalToolbarContent = this._shouldShowAdditionalToolbarContent();
        const contentClassName = showAdditionalContent ? 'with-content' : 'without-content';
        const footerClassName = DISPLAY_WELCOME_FOOTER ? 'with-footer' : 'without-footer';

        return (
            <div className={`welcome ${contentClassName} ${footerClassName}`} id="welcome_page">
                <Navbar />
                <div className="header">
                    <div className="header-image" />
                    <div className="header-container">
                        <h1 className="header-text-title">{t('welcomepage.headerTitle')}</h1>
                        <span className="header-text-subtitle">{t('welcomepage.headerSubtitle')}</span>
                        <div id="enter_room">
                            <div className="join-meeting-container">
                                <div className="enter-room-input-container">
                                    <form onSubmit={this._onFormSubmit}>
                                        <input
                                            aria-disabled="false"
                                            aria-label="Meeting name input"
                                            autoFocus={true}
                                            className="enter-room-input"
                                            id="enter_room_field"
                                            onChange={this._onRoomChange}
                                            pattern={ROOM_NAME_VALIDATE_PATTERN_STR}
                                            placeholder={this.state.roomPlaceholder}
                                            ref={this._setRoomInputRef}
                                            type="text"
                                            value={this.state.room}
                                        />
                                    </form>
                                </div>
                                {/* Hiển thị nút theo trạng thái đăng nhập */}
                                {this._isLoggedIn() ? (
                                    <button
                                        aria-disabled="false"
                                        aria-label="Start meeting"
                                        className="welcome-page-button"
                                        id="enter_room_button"
                                        onClick={this._onFormSubmit}
                                        tabIndex={0}
                                        type="button"
                                    >
                                        {t('welcomepage.startMeeting')}
                                    </button>
                                ) : (
                                    <button
                                        aria-disabled="false"
                                        aria-label="Login required"
                                        className="welcome-page-button"
                                        id="login_button"
                                        onClick={() => window.location.href = '/login'}
                                        tabIndex={0}
                                        type="button"
                                    >
                                        Đăng nhập để bắt đầu
                                    </button>
                                )}
                            </div>
                        </div>
                        {this._titleHasNotAllowCharacter && (
                            <div className="not-allow-title-character-div" role="alert">
                                <Icon src={IconWarning} />
                                <span className="not-allow-title-character-text">
                                    {t('welcomepage.roomNameAllowedChars')}
                                </span>
                            </div>
                        )}
                        {this._renderInsecureRoomNameWarning()}
                        {_moderatedRoomServiceUrl && (
                            <div id="moderated-meetings">
                                {translateToHTML(t, 'welcomepage.moderatedMessage', { url: _moderatedRoomServiceUrl })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="welcome-cards-container">
                    <div className="welcome-card-column">
                        <div className="welcome-tabs welcome-card welcome-card--blue">
                            {this._renderTabs()}
                        </div>
                        {showAdditionalCard ? (
                            <div className="welcome-card welcome-card--dark" ref={this._setAdditionalCardRef} />
                        ) : null}
                    </div>
                    {showAdditionalContent ? (
                        <div className="welcome-page-content" ref={this._setAdditionalContentRef} />
                    ) : null}
                </div>
                {DISPLAY_WELCOME_FOOTER && this._renderFooter()}
            </div>
        );
    }

    _onFormSubmit(event: React.FormEvent) {
        event.preventDefault();

        // Kiểm tra đăng nhập trước khi bắt đầu cuộc họp
        if (!this._isLoggedIn()) {
            alert('Vui lòng đăng nhập để bắt đầu cuộc họp!');
            window.location.href = '/login';
            return;
        }

        if (!this._roomInputRef || this._roomInputRef.reportValidity()) {
            this._onJoin();
        }
    }

    // Giữ nguyên các phương thức khác như _onRoomChange, _renderFooter, v.v.
    _onRoomChange(event: React.ChangeEvent<HTMLInputElement>) {
        const specialCharacters = ['?', '&', ':', '\'', '"', '%', '#', '.'];
        this._titleHasNotAllowCharacter = specialCharacters.some(char => event.target.value.includes(char));
        super._onRoomChange(event.target.value);
    }

    _renderFooter() {
        // Giữ nguyên code gốc
    }

    _renderTabs() {
        // Giữ nguyên code gốc
    }

    _doRenderInsecureRoomNameWarning() {
        return (
            <div className="insecure-room-name-warning">
                <Icon src={IconWarning} />
                <span>{getUnsafeRoomText(this.props.t, 'welcome')}</span>
            </div>
        );
    }

    _setAdditionalCardRef(el: HTMLDivElement) {
        this._additionalCardRef = el;
    }

    _setAdditionalContentRef(el: HTMLDivElement) {
        this._additionalContentRef = el;
    }

    _setAdditionalToolbarContentRef(el: HTMLDivElement) {
        this._additionalToolbarContentRef = el;
    }

    _setRoomInputRef(el: HTMLInputElement) {
        this._roomInputRef = el;
    }

    _shouldShowAdditionalCard() {
        return interfaceConfig.DISPLAY_WELCOME_PAGE_ADDITIONAL_CARD
            && this._additionalCardTemplate?.content
            && this._additionalCardTemplate?.innerHTML?.trim();
    }

    _shouldShowAdditionalContent() {
        return interfaceConfig.DISPLAY_WELCOME_PAGE_CONTENT
            && this._additionalContentTemplate?.content
            && this._additionalContentTemplate?.innerHTML?.trim();
    }

    _shouldShowAdditionalToolbarContent() {
        return interfaceConfig.DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT
            && this._additionalToolbarContentTemplate?.content
            && this._additionalToolbarContentTemplate?.innerHTML.trim();
    }
}

export default translate(connect(_mapStateToProps)(WelcomePage));