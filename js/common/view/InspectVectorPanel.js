// Copyright 2019, University of Colorado Boulder

/**
 * View for the 'Inspect a Vector' Panel at the top of the scene. Displays vector attributes (i.e label, magnitude etc.)
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const Panel = require( 'SUN/Panel' );
  const Range = require( 'DOT/Range' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // strings
  const inspectAVectorString = require( 'string!VECTOR_ADDITION/inspectAVector' );
  const selectAVectorString = require( 'string!VECTOR_ADDITION/selectAVector' );
  const xString = require( 'string!VECTOR_ADDITION/x' );
  const yString = require( 'string!VECTOR_ADDITION/y' );

  // constants
  const CREATOR_PANEL_WIDTH = 450;
  const CREATOR_PANEL_HEIGHT = 50;
  const CREATOR_PANEL_OPTIONS = _.extend( {}, VectorAdditionConstants.PANEL_OPTIONS, {
    cornerRadius: 5,
    xMargin: 7,
    yMargin: 2,
    minWidth: CREATOR_PANEL_WIDTH,
    maxWidth: CREATOR_PANEL_WIDTH,
    maxHeight: CREATOR_PANEL_HEIGHT,
    fill: VectorAdditionColors.INSPECT_VECTOR_BACKGROUND,
    stroke: VectorAdditionColors.PANEL_STROKE_COLOR
  } );
  const EXPAND_COLLAPSE_BUTTON_OPTIONS = {
    sideLength: 21
  };
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;
  const EXPAND_COLLAPSE_BUTTON_RIGHT_MARGIN = 15;
  const LABEL_RIGHT_MARGIN = 9;
  const LABEL_LEFT_MARGIN = 21;

  const LABEL_WIDTH = 16;

  class InspectVectorPanel extends Panel {
    /**
     * @constructor
     * @param {Array.<VectorSet>} vectorSets - the vectorSets that will be able to be displayed
     * @param {Object} [options]
     */
    constructor( vectorSets, options ) {

      options = _.extend( {
        isExpandedInitially: false // {boolean} - true means the panel will start off as expanded
      }, options );

      assert && assert( vectorSets.filter( vectorSet => !( vectorSet instanceof VectorSet ).length === 0 ),
        `invalid vectorSets: ${vectorSets}` );
      assert && assert( typeof options.isExpandedInitially === 'boolean',
        `invalid options.isExpandedInitially: ${options.isExpandedInitially}` );

      // Create an arbitrary node as a reference to the content in the panel
      const panelContent = new Node();

      super( panelContent, CREATOR_PANEL_OPTIONS );

      // @private {BooleanProperty}
      this.expandedProperty = new BooleanProperty( options.isExpandedInitially );

      //----------------------------------------------------------------------------------------
      // Create the scenery nodes that always exist

      // @private {ExpandCollapseButton}
      this.expandCollapseButton = new ExpandCollapseButton( this.expandedProperty,
        _.extend( EXPAND_COLLAPSE_BUTTON_OPTIONS, {
          centerY: this.centerY
        } ) );

      // Convenience variable of the panel content width (width of the creator panel excluding the collapse button)
      const panelContentWidth = CREATOR_PANEL_WIDTH
                                - this.expandCollapseButton.right
                                - EXPAND_COLLAPSE_BUTTON_RIGHT_MARGIN;

      // @private {Text}
      this.inspectVectorText = new Text( inspectAVectorString, {
        font: PANEL_FONT,
        centerY: this.centerY,
        left: this.expandCollapseButton.right + EXPAND_COLLAPSE_BUTTON_RIGHT_MARGIN,
        maxWidth: panelContentWidth
      } );

      // @private {Text}
      this.selectVectorText = new Text( selectAVectorString, {
        font: PANEL_FONT,
        maxWidth: panelContentWidth
      } );

      // @private {HBox} - this is the container for the attributes of the vector (i.e. magnitude, angle, x and
      // y components)
      this.vectorAttributesDisplayContainer = new HBox( {
        spacing: LABEL_LEFT_MARGIN,
        align: 'center',
        children: [ this.selectVectorText ],
        maxWidth: panelContentWidth
      } );

      //----------------------------------------------------------------------------------------

      panelContent.setChildren( [
        this.expandCollapseButton,
        this.inspectVectorText,
        // Constrain the size of vectorAttributesDisplayContainer
        new AlignBox( this.vectorAttributesDisplayContainer, {
          xAlign: 'left',
          yAlign: 'center',
          alignBounds: new Bounds2( 0, 0, panelContentWidth, CREATOR_PANEL_HEIGHT - 2 * CREATOR_PANEL_OPTIONS.yMargin ),
          centerY: this.centerY,
          left: this.expandCollapseButton.right + EXPAND_COLLAPSE_BUTTON_RIGHT_MARGIN
        } )
      ] );

      //----------------------------------------------------------------------------------------

      // observe changes to the expanded property (when the expanded collapse button is clicked)
      // Doesn't need to be unlinked because the inspect vector panel always exists
      this.expandedProperty.link( ( isExpanded ) => {
        this.inspectVectorText.visible = !isExpanded;
        this.vectorAttributesDisplayContainer.visible = isExpanded;
      } );

      // @private {boolean} flag to indicate if this panel has ever displayed a vector's attributes
      this.hasDisplayedVectorAttributes = false;


      //----------------------------------------------------------------------------------------

      vectorSets.forEach( ( vectorSet ) => {

        const vectorSumActiveListener = ( isActive ) => {
          if ( isActive ) {
            this.displayVectorsAttributes( vectorSet.vectorSum );
          }
        };

        // Observe changes to the vector sum, when it is active, display it.
        // Doesn't need to be unlinked because 1. VectorSets cannot be disposed and 2. vectorSums are never disposed
        vectorSet.vectorSum.isActiveProperty.link( vectorSumActiveListener );

        // Observe changes to the vectors, when an item is added, add a link to display the vector when it's active
        // No need to remove itemAddedListener because VectorSets cannot be disposed
        vectorSet.vectors.addItemAddedListener( ( addedVector ) => {

          const vectorActiveListener = ( isActive ) => {
            if ( isActive ) {
              this.displayVectorsAttributes( addedVector );
            }
          };
          addedVector.isActiveProperty.link( vectorActiveListener );

          const vectorRemovedListener = function( removedVector ) {
            if ( removedVector === addedVector ) {
              removedVector.isActiveProperty.unlink( vectorActiveListener );
              vectorSet.vectors.removeItemRemovedListener( vectorRemovedListener );
            }
          };
          vectorSet.vectors.addItemRemovedListener( vectorRemovedListener );
        } );
      } );
    }

    /**
     * Displays a vectors attributes
     * @param {VectorModel} activeVector
     * @private
     */
    displayVectorsAttributes( activeVector ) {

      // If we haven't displayed a single vector yet, this will be the first time. Thus, dispose the 'Select a Vector'
      // text and create the new Nodes.
      if ( !this.hasDisplayedVectorAttributes ) {
        this.hasDisplayedVectorAttributes = true;
        this.selectVectorText.dispose();

        this.createDisplayVectorNodes();
      }

      this.magnitudeTextNode.setFormula( `\|\\mathbf{\\vec{${activeVector.label}\}\}|` );

      this.magnitudeDisplayNode.setChildren( [
        new NumberDisplay( activeVector.magnitudeProperty, new Range( 0, 100 ), {
          decimalPlaces: 1
        } ) ] );

      this.angleDisplayNode.setChildren( [
        new NumberDisplay( activeVector.angleDegreesProperty, new Range( -180, 180 ), {
          decimalPlaces: 1
        } ) ] );

      this.xComponentText.setText( `${activeVector.label}<sub>${xString}</sub>` );

      this.xComponentDisplayNode.setChildren( [
        new NumberDisplay( activeVector.xComponentProperty, new Range( -60, 60 ), {
          decimalPlaces: 1
        } ) ] );

      this.yComponentText.setText( `${activeVector.label}<sub>${yString}</sub>` );

      this.yComponentDisplayNode.setChildren( [
        new NumberDisplay( activeVector.yComponentProperty, new Range( -40, 40 ), {
          decimalPlaces: 1
        } ) ] );
    }

    /**
     * Creates the scenery nodes for displaying a vectors attributes
     * @private
     */
    createDisplayVectorNodes() {

      // @private {FormulaNode}
      this.magnitudeTextNode = new FormulaNode( '', { maxWidth: LABEL_WIDTH } );

      // @private {Node} - arbitrary node for now
      this.magnitudeDisplayNode = new Node();

      // @private {RichText}
      this.angleText = new RichText( MathSymbols.THETA, { maxWidth: LABEL_WIDTH } );

      // @private {Node}
      this.angleDisplayNode = new Node();

      // @private {RichText}
      this.xComponentText = new RichText( '', { maxWidth: LABEL_WIDTH } );

      // @private {Node}
      this.xComponentDisplayNode = new Node();

      // @private {RichText}
      this.yComponentText = new RichText( '', { maxWidth: LABEL_WIDTH } );

      // @private {Node}
      this.yComponentDisplayNode = new Node();

      this.addNumberDisplayAndLabel( this.magnitudeTextNode, this.magnitudeDisplayNode );
      this.addNumberDisplayAndLabel( this.angleText, this.angleDisplayNode );
      this.addNumberDisplayAndLabel( this.xComponentText, this.xComponentDisplayNode );
      this.addNumberDisplayAndLabel( this.yComponentText, this.yComponentDisplayNode );
    }

    /**
     * Adds a HBox of the label and the number display container
     * Makes the label have a 'fixed' width
     * @param {string} label
     * @param {Node} numberDisplayContainer
     * @private
     */
    addNumberDisplayAndLabel( label, numberDisplayContainer ) {
      // Make the label have a 'fixed' width
      const fixedWidthLabel = new AlignBox( label, {
        xAlign: 'center',
        yAlign: 'center',
        alignBounds: new Bounds2( 0, 0, LABEL_WIDTH, this.height ),
        maxWidth: LABEL_WIDTH
      } );
      this.vectorAttributesDisplayContainer.addChild( new HBox( {
        spacing: LABEL_RIGHT_MARGIN,
        children: [ fixedWidthLabel, numberDisplayContainer ]
      } ) );
    }

    /**
     * Resets the status of the Inspect Vector Panel
     * @public
     */
    reset() {
      this.expandedProperty.reset();

      // See https://github.com/phetsims/vector-addition/issues/38, remove the nodes
      this.hasDisplayedVectorAttributes = false;

      this.selectVectorText = new Text( selectAVectorString, { font: PANEL_FONT } );
      this.vectorAttributesDisplayContainer.setChildren( [ this.selectVectorText ] );
    }
  }

  return vectorAddition.register( 'InspectVectorPanel', InspectVectorPanel );
} );