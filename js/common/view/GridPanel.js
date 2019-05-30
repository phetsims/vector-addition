// Copyright 2019, University of Colorado Boulder

/**
 * Control panel for various features related to the play area.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Panel = require( 'SUN/Panel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );

  // strings
  const componentsString = require( 'string!VECTOR_ADDITION/components' );
  const sumString = require( 'string!VECTOR_ADDITION/sum' );
  const valuesString = require( 'string!VECTOR_ADDITION/values' );

  // constants
  const TEXT_OPTIONS = {
    font: VectorAdditionConstants.PANEL_FONT,
    maxWidth: 200, // determined empirically
    minWidth: 110
  };
  const PANEL_OPTIONS = VectorAdditionConstants.PANEL_OPTIONS;

  /**
   * @constructor
   */
  class GridPanel extends Panel {

    /**
     * @param {Property.<boolean>} sumVisibleProperty is the sum visible on the graph
     * @param {Property.<boolean>} valuesVisibleProperty are the numerical values of the vector visible on the graph
     * @param {Property.<boolean>} angleVisibleProperty is the vector angle visible on the graph
     * @param {Property.<boolean>} gridVisibleProperty is the grid visible on the graph
     * @param {EnumerationProperty<ComponentStyles>} componentStyleProperty which component style to display.
     * @param {Object} [options]
     * @constructor
     */
    constructor( sumVisibleProperty,
                 valuesVisibleProperty,
                 angleVisibleProperty,
                 gridVisibleProperty,
                 componentStyleProperty,
                 options ) {


      options = _.extend( {
        is1D: true
      }, PANEL_OPTIONS, options );


      const ICON_SPACING = 15;

      // create the arrow icon with the icon factory
      // TODO: make the length and the color constants
      const arrowIconNode = VectorAdditionIconFactory.createArrowIcon( 25, 'blue' );

      // 'Sum' checkbox
      const sumCheckbox = new Checkbox( new LayoutBox( {
        orientation: 'horizontal',
        spacing: ICON_SPACING,
        children: [
          new Text( sumString, TEXT_OPTIONS ),
          arrowIconNode
        ]
      } ), sumVisibleProperty );

      // 'Values' checkbox
      const valuesCheckbox = new Checkbox( new LayoutBox( {
        orientation: 'horizontal',
        children: [
          new Text( valuesString, TEXT_OPTIONS )
        ]
      } ), valuesVisibleProperty );

      // 'Angle' checkbox
      const angleCheckbox = new Checkbox( new LayoutBox( {
        orientation: 'horizontal',
        children: [
          VectorAdditionIconFactory.createAngleIcon()
        ]
      } ), angleVisibleProperty );

      // Grid checkbox
      // 'Angle' checkbox
      const gridCheckbox = new Checkbox( new LayoutBox( {
        orientation: 'horizontal',
        spacing: ICON_SPACING,
        children: [
          // create the grid icon
          VectorAdditionIconFactory.createGridIcon( 25, 'blue' )
        ]
      } ), gridVisibleProperty );

      // add a horizontal line that seperates the panel into two sections
      const horizontalLine = new Line( 0, 0, VectorAdditionConstants.RIGHT_CONTENT_WIDTH, 0, {
        stroke: 'black'
      } );

      // add a label for the second section of the panel
      const componentsLabel = new Text( componentsString, TEXT_OPTIONS );

      // component style radio buttons
      const componentStyleRadioButtonContent = [ {
        value: ComponentStyles.INVISIBLE,
        node: new Text( 'invisi', TEXT_OPTIONS )
      }, {
        value: ComponentStyles.PARALLELOGRAM,
        node: new Text( 'para', TEXT_OPTIONS )
      }, {
        value: ComponentStyles.TRIANGLE,
        node: new Text( 'tri', TEXT_OPTIONS )
      }, {
        value: ComponentStyles.ON_AXIS,
        node: new Text( 'axis', TEXT_OPTIONS )
      } ];

      const componentStyleRadioButtons = new RadioButtonGroup(
        componentStyleProperty, componentStyleRadioButtonContent, {
          baseColor: 'white',
          selectedStroke: '#419ac9',
          selectedLineWidth: 2,
          right: 900,
          top: 100,
          orientation: 'vertical'
        } );


      // vertical layout
      const contentNode = new LayoutBox( {
        children: ( options.is1D ) ?
          [ sumCheckbox, valuesCheckbox, gridCheckbox ] :
          [ sumCheckbox, valuesCheckbox, angleCheckbox, gridCheckbox, horizontalLine, componentsLabel ],
        orientation: 'vertical',
        spacing: 10,
        align: 'left'
      } );

      super( contentNode, options );
    }
  }

  return vectorAddition.register( 'GridPanel', GridPanel );
} );
