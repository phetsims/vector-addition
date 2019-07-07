// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel at the top of the equation scene that allows the user to toggle the coefficients of vectors.
 *
 * 'Is a' relationship with ExpandCollapsePanel
 *    - when closed, displays TODO: what does it display?
 *    - when open displays a series of number pickers and formula nodes
 *
 * A visual:
 *  https://user-images.githubusercontent.com/42391580/60623943-4128d000-9da1-11e9-9dc0-393bfa332117.png
 *
 * This panel exists for the entire sim and is never disposed.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const EquationVectorSet = require( 'VECTOR_ADDITION/equation/model/EquationVectorSet' );
  const ExpandCollapsePanel = require( 'VECTOR_ADDITION/common/view/ExpandCollapsePanel' );
  // const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  // const HBox = require( 'SCENERY/nodes/HBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  const Range = require( 'DOT/Range' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );

  //----------------------------------------------------------------------------------------
  // constants

  // fixed width and height of the panel
  // const COEFFICIENT_PANEL_WIDTH = 300;
  // const COEFFICIENT_PANEL_HEIGHT = VectorAdditionConstants.EXPAND_COLLAPSE_PANEL_HEIGHT;

  // font for the panel
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;

  // margin between the number picker and the label
  // const LABEL_PICKER_MARGIN = 5;

  const NUMBER_PICKER_OPTIONS = VectorAdditionConstants.NUMBER_PICKER_OPTIONS;

  class CoefficientSelectorPanel extends ExpandCollapsePanel {
    /**
     * @constructor
     *
     * @param {EquationVectorSet} equationVectorSet
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. Some options are
     *                             specific to this class while some are passed to the superclass. See the code where
     *                             the options are set in the early portion of the constructor for details.
     */
    constructor( equationVectorSet, options ) {

      assert && assert( equationVectorSet instanceof EquationVectorSet,
        `invalid equationVectorSet: ${equationVectorSet}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {

        // specific to this class
        top: 55,
        left: 165

        // // super class options
        // contentFixedWidth: COEFFICIENT_PANEL_WIDTH, // {number|null} fixed size of the panel (see superclass)
        // contentFixedHeight: COEFFICIENT_PANEL_HEIGHT // {number|null} fixed size of the panel (see superclass)

      }, options );


      //----------------------------------------------------------------------------------------
      // Create the scenery node for when the panel is closed
      //----------------------------------------------------------------------------------------
      const closedNodeText = new Text( 'TODO: what do we put here', {
        font: PANEL_FONT
      } );

      //----------------------------------------------------------------------------------------
      // Create the scenery nodes for when the panel is open
      //----------------------------------------------------------------------------------------

      // Create the content container for the open content
      const panelOpenContent = new Node();


      const test = new NumberPicker( new NumberProperty( 0 ), new Property( new Range( -100, 100 ) ), NUMBER_PICKER_OPTIONS );

      panelOpenContent.addChild( test );
      //----------------------------------------------------------------------------------------
      // Create the inspect a vector panel
      //----------------------------------------------------------------------------------------

      super( closedNodeText, panelOpenContent, {
        contentFixedWidth: options.contentFixedWidth,
        contentFixedHeight: options.contentFixedHeight
      } );

      //----------------------------------------------------------------------------------------
      // Layout the inspect vector panel
      //----------------------------------------------------------------------------------------

      this.top = options.top;
      this.left = options.left;
    }
  }

  return vectorAddition.register( 'CoefficientSelectorPanel', CoefficientSelectorPanel );
} );