// Copyright 2019-2025, University of Colorado Boulder

/**
 * ComponentStyleControl is the control for selecting how to visually represent component vectors.
 * It consists of a labeled group of radio buttons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Brandon Li
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import ComponentVectorStyles from '../model/ComponentVectorStyles.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ComponentStyleRadioButtonGroup from './ComponentStyleRadioButtonGroup.js';

const MAX_WIDTH = VectorAdditionConstants.GRAPH_CONTROL_PANEL_CONTENT_WIDTH;

export default class ComponentStyleControl extends VBox {

  public constructor( componentStyleProperty: EnumerationProperty<ComponentVectorStyles> ) {

    const children: Node[] = [];

    // 'Components' label, left justified
    const componentsText = new Text( VectorAdditionStrings.componentsStringProperty, {
      font: VectorAdditionConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH
    } );
    children.push( componentsText );

    // Radio buttons, centered in maxWidth by using an AlignBox
    const componentStyleRadioButtonGroup = new ComponentStyleRadioButtonGroup( componentStyleProperty );
    children.push( new AlignBox( componentStyleRadioButtonGroup, {
      alignBounds: new Bounds2( 0, 0, MAX_WIDTH, componentStyleRadioButtonGroup.height )
    } ) );

    super( {

      // VBoxOptions
      children: children,
      align: 'left',
      spacing: VectorAdditionConstants.GRAPH_CONTROL_PANEL_Y_SPACING,
      isDisposable: false
    } );
  }
}

vectorAddition.register( 'ComponentStyleControl', ComponentStyleControl );